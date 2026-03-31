const admin = require("../config/firebaseAdmin");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded.email) {
      return res.status(401).json({ message: "Token is missing an email" });
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email.toLowerCase(),
      name: decoded.name || decoded.email.split("@")[0],
    };

    return next();
  } catch (error) {
    console.log("VERIFY ERROR:", error.message);
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
};

module.exports = protect;
