// firebase.js (CommonJS version)
const fs = require("fs");
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = JSON.parse(
  fs.readFileSync("./permissions.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Export in CommonJS form:
module.exports = { db };
