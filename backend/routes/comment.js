// routes/comments.js
const express = require("express");
const admin = require("firebase-admin");
const router = express.Router();

// Import your initialized Firestore `db` from firebase.js
const { db } = require("../firebase");

// Helper alias for FieldValue.arrayUnion
const arrayUnion = admin.firestore.FieldValue.arrayUnion;

router.post("/", async (req, res) => {
  const recipeId = req.query.id;
  if (!recipeId) {
    return res
      .status(400)
      .json({ error: "Recipe ID is required as ?id=<recipeId>" });
  }

  const { user, rating, text, date, upvotes } = req.body;
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
    const newComment = { user, rating, text, date, upvotes};
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


router.put("/upvote", async (req, res) => {
  const recipeId = req.query.id;
  const indexStr = req.query.index;

  if (!recipeId) {
    return res
      .status(400)
      .json({ error: "`id` (recipeId) is required as ?id=<recipeId>" });
  }
  if (indexStr == null) {
    return res
      .status(400)
      .json({ error: "`index` is required as ?index=<commentIndex>" });
  }

  const commentIndex = parseInt(indexStr, 10);
  if (isNaN(commentIndex) || commentIndex < 0) {
    return res
      .status(400)
      .json({ error: "`index` must be a non-negative integer." });
  }

  try {
    const recipeRef = db.collection("recipes").doc(recipeId);
    const snap = await recipeRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    const data = snap.data();
    const comments = Array.isArray(data.comments) ? data.comments : [];

    if (commentIndex >= comments.length) {
      return res
        .status(400)
        .json({ error: "`index` is out of bounds for this recipe’s comments." });
    }

    // Clone the array so we don’t mutate the original directly
    const updatedComments = comments.slice();

    // Ensure the comment object has an `upvotes` field
    const oldComment = updatedComments[commentIndex];
    const oldUpvotes = typeof oldComment.upvotes === "number" ? oldComment.upvotes : 0;
    updatedComments[commentIndex] = {
      ...oldComment,
      upvotes: oldUpvotes + 1,
    };
    // Write the entire array back to Firestore
    await recipeRef.update({ comments: updatedComments });

    return res.status(200).json({
      message: "Upvoted successfully.",
      commentIndex,
      newUpvotes: updatedComments[commentIndex].upvotes,
    });
  } catch (error) {
    console.error("Error upvoting comment:", error);
    return res.status(500).json({ error: "Failed to upvote comment." });
  }
});


module.exports = router;
