const path = require("path");
const http = require("http");
const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = require("../app");
const connectDB = require("../config/db");
const admin = require("../config/firebaseAdmin");
const User = require("../models/user");
const Learning = require("../models/Learning");
const Workspace = require("../models/Workspace");

const FIREBASE_WEB_API_KEY =
  process.env.FIREBASE_WEB_API_KEY ||
  "AIzaSyDYX2ZNVbR007DBPulS7ibDpB2IvvO8PdQ";

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const createServer = () =>
  new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => resolve(server));
  });

const closeServer = (server) =>
  new Promise((resolve) => {
    if (!server) {
      resolve();
      return;
    }

    server.close(() => resolve());
  });

const request = async (method, url, options = {}) =>
  axios({
    method,
    url,
    validateStatus: () => true,
    ...options,
  });

const signInWithPassword = async (email, password) => {
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`,
    {
      email,
      password,
      returnSecureToken: true,
    }
  );

  return response.data.idToken;
};

const cleanupTestUser = async (email, uid) => {
  await Workspace.deleteMany({ user: email }).catch(() => {});
  await Learning.deleteMany({ user: email }).catch(() => {});
  await User.deleteMany({ email }).catch(() => {});

  if (uid) {
    await admin.auth().deleteUser(uid).catch(() => {});
  }
};

const run = async () => {
  let server;
  let firebaseUser;
  const now = Date.now();
  const testEmail = `smoke-${now}@preptrack.test`;
  const testPassword = `Smoke!${String(now).slice(-8)}`;
  const baseName = "Smoke Test";

  try {
    await connectDB();
    server = await createServer();

    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}`;

    firebaseUser = await admin.auth().createUser({
      email: testEmail,
      password: testPassword,
      displayName: baseName,
      emailVerified: true,
    });

    const idToken = await signInWithPassword(testEmail, testPassword);
    const authHeaders = {
      Authorization: `Bearer ${idToken}`,
    };

    const health = await request("get", `${baseUrl}/api/health`);
    assert(health.status === 200, "Health route failed");
    assert(health.data.status === "ok", "Health payload invalid");

    const testRoute = await request("get", `${baseUrl}/api/test`);
    assert(testRoute.status === 200, "Test route failed");

    const unauthorizedProfile = await request(
      "get",
      `${baseUrl}/api/user/profile`
    );
    assert(
      unauthorizedProfile.status === 401,
      "Protected route should reject missing token"
    );

    const syncUser = await request("post", `${baseUrl}/api/auth/sync-user`, {
      headers: authHeaders,
      data: { name: baseName },
    });
    assert(syncUser.status === 200, "Sync user failed");

    const profile = await request("get", `${baseUrl}/api/user/profile`, {
      headers: authHeaders,
    });
    assert(profile.status === 200, "Profile fetch failed");
    assert(profile.data.email === testEmail, "Profile email mismatch");

    const createdLearning = await request(
      "post",
      `${baseUrl}/api/learning`,
      {
        headers: authHeaders,
        data: {
          title: "Smoke Topic",
          difficulty: "Medium",
        },
      }
    );
    assert(createdLearning.status === 201, "Learning creation failed");
    const learningId = createdLearning.data._id;

    const learningList = await request("get", `${baseUrl}/api/learning`, {
      headers: authHeaders,
    });
    assert(learningList.status === 200, "Learning fetch failed");
    assert(
      learningList.data.some((item) => item._id === learningId),
      "Created learning item missing from list"
    );

    const toggledLearning = await request(
      "patch",
      `${baseUrl}/api/learning/${learningId}`,
      {
        headers: authHeaders,
      }
    );
    assert(toggledLearning.status === 200, "Learning toggle failed");
    assert(
      toggledLearning.data.status === "Completed",
      "Learning item did not toggle to completed"
    );

    const workspaceLoad = await request(
      "get",
      `${baseUrl}/api/workspace/${learningId}`,
      {
        headers: authHeaders,
      }
    );
    assert(workspaceLoad.status === 200, "Workspace load failed");

    const savedWorkspace = await request(
      "post",
      `${baseUrl}/api/workspace/${learningId}`,
      {
        headers: authHeaders,
        data: {
          language: "javascript",
          code: "console.log('smoke js')",
        },
      }
    );
    assert(savedWorkspace.status === 200, "Workspace save failed");

    const runJavaScript = await request("post", `${baseUrl}/api/code/run`, {
      headers: authHeaders,
      data: {
        language: "javascript",
        code: "console.log('smoke js')",
      },
    });
    assert(runJavaScript.status === 200, "JavaScript execution failed");
    assert(
      String(runJavaScript.data.output).includes("smoke js"),
      "JavaScript execution output mismatch"
    );

    const runPython = await request("post", `${baseUrl}/api/code/run`, {
      headers: authHeaders,
      data: {
        language: "python",
        code: "print('smoke py')",
      },
    });
    assert(runPython.status === 200, "Python execution failed");
    assert(
      String(runPython.data.output).includes("smoke py"),
      "Python execution output mismatch"
    );

    const unsupportedRuntime = await request(
      "post",
      `${baseUrl}/api/code/run`,
      {
        headers: authHeaders,
        data: {
          language: "java",
          code: "class Main {}",
        },
      }
    );
    assert(
      unsupportedRuntime.status === 400,
      "Unsupported language should return 400"
    );

    if (process.env.SMOKE_TEST_AI === "true") {
      const aiResponse = await request("post", `${baseUrl}/api/ai/chat`, {
        headers: authHeaders,
        data: {
          message: "Say hello in one short sentence.",
        },
      });

      assert(aiResponse.status === 200, "AI route failed");
      assert(
        typeof aiResponse.data.reply === "string" &&
          aiResponse.data.reply.trim().length > 0,
        "AI reply was empty"
      );
    }

    const deleteLearning = await request(
      "delete",
      `${baseUrl}/api/learning/${learningId}`,
      {
        headers: authHeaders,
      }
    );
    assert(deleteLearning.status === 200, "Learning delete failed");

    console.log("Smoke test passed");
  } finally {
    await cleanupTestUser(testEmail, firebaseUser?.uid);
    await closeServer(server);
    await mongoose.connection.close().catch(() => {});
  }
};

run().catch((error) => {
  console.error("Smoke test failed:", error.response?.data || error.message);
  process.exitCode = 1;
});
