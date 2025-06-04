// routes/comments.js
const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();

// Import your initialized Firestore `db` from firebase.js
const { db } = require("../firebase");

// Helper alias for FieldValue.arrayUnion
const arrayUnion = admin.firestore.FieldValue.arrayUnion;

/**
 * POST /comments?id=<recipeId>
 * 
 * Body JSON should contain:
 *   { user, rating, text, date }
 *
 * This route will take those fields and append them as a new object
 * in the `comments` array of the recipe document.
 */
router.post("/", async (req, res) => {
  const recipeId = req.query.id;
  if (!recipeId) {
    return res
      .status(400)
      .json({ error: "Recipe ID is required as ?id=<recipeId>" });
  }

  const { user, rating, text, date } = req.body;
  if (!user || !text) {
    return res
      .status(400)
      .json({ error: "Both `user` and `text` fields are required in the body." });
  }

  try {
    // 1) Make sure the recipe exists
    const recipeRef = db.collection("recipes").doc(recipeId);
    const recipeSnap = await recipeRef.get();
    if (!recipeSnap.exists) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    // 2) Build the comment object exactly as your front-end expects
    const newComment = { user, rating, text, date };

    // 3) Use arrayUnion to append to the existing `comments` array
    await recipeRef.update({
      comments: arrayUnion(newComment),
    });

    // 4) Return success (you could return the new comment or just a 200)
    return res.status(200).json({ message: "Comment added successfully." });
  } catch (error) {
    console.error("Error adding comment to recipe:", error);
    return res.status(500).json({ error: "Failed to add comment." });
  }
});

module.exports = router;
