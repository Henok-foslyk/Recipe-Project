// routes/firebase_recipe.js
const express = require("express");
const router = express.Router();

// Since you initialized `db = admin.firestore()` in firebase.js:
const { db } = require("../firebase"); 
const admin = require("firebase-admin"); 
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

router.put("/save", async (req, res) => {
  const { userId, recipeId } = req.query; // ⬅️ YES, you're passing these via query
  console.log("User ID: ", userId, " Recipe Id: ", recipeId);
  if (!userId || !recipeId) {
    return res.status(400).json({ error: "userId and recipeId are required in the query parameters." });
  }

  try {
    // Get the recipe document from recipes collection
    const recipeSnap = await db.collection("recipes").doc(recipeId).get();

    if (!recipeSnap.exists) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    const recipeData = recipeSnap.data();

    // Write to users/{userId}/savedRecipes/{recipeId}
    await db
      .collection("users")
      .doc(userId)
      .collection("savedRecipes")
      .doc(recipeId)
      .set({
        ...recipeData,
        savedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return res.status(200).json({ message: "Recipe successfully saved to user's savedRecipes." });
  } catch (error) {
    console.error("Error saving recipe for user:", error);
    return res.status(500).json({ error: "Internal error while saving recipe." });
  }
});

router.delete("/delete", async (req, res) => {
  const { userId, recipeId } = req.query;

  if (!userId || !recipeId) {
    return res.status(400).json({ error: "userId and recipeId are required in the query parameters." });
  }

  try {
    const savedRecipeRef = db
      .collection("users")
      .doc(userId)
      .collection("savedRecipes")
      .doc(recipeId);

    await savedRecipeRef.delete();

    return res.status(200).json({ message: "Recipe removed from saved list." });
  } catch (error) {
    console.error("Error removing recipe for user:", error);
    return res.status(500).json({ error: "Failed to remove saved recipe." });
  }
});

module.exports = router;
