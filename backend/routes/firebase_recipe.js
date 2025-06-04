// routes/firebase_recipe.js
const express = require("express");
const router = express.Router();

// Since you initialized `db = admin.firestore()` in firebase.js:
const { db } = require("../firebase"); 

router.get("/", async (req, res) => {
  const recipeId = req.query.id;
  if (!recipeId) {
    return res.status(400).json({ error: "Recipe ID is required in ?id=" });
  }

  try {
    // 1) Use Admin SDK style: db.collection("recipes").doc(recipeId)
    const docRef = db.collection("recipes").doc(recipeId);

    // 2) Fetch the document snapshot
    const docSnap = await docRef.get();

    // 3) If it doesn’t exist, return 404
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    // 4) Otherwise, return the data
    return res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    return res.status(500).json({ error: "Failed to fetch recipe." });
  }
});

module.exports = router;
