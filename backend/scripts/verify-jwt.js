// function to manually verify jwt
// from the very root run: node backend/scripts/verify-jwt.js
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const jwt = require("jsonwebtoken");

function verifyToken(token) {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    console.log("Token is valid:", decoded);
  } catch (err) {
    console.error("Token verification failed:", err.message);
  }
}

verifyToken("insert a token you want to verify here");
