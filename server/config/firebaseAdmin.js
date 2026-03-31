const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const loadServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    return JSON.parse(
      Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
        "base64"
      ).toString("utf8")
    );
  }

  const localKeyPath = path.join(__dirname, "serviceAccountKey.json");

  if (fs.existsSync(localKeyPath)) {
    return require(localKeyPath);
  }

  throw new Error(
    "Firebase Admin credentials are missing. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_BASE64."
  );
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(loadServiceAccount()),
  });
}

module.exports = admin;
