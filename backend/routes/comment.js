import express from 'express';
import { db } from '../firebase.js';
import { doc, updateDoc, arrayUnion, getDoc} from 'firebase/firestore';

const router = express.Router();

// DELETE /api/recipes/:id
router.post("/:id", async (req, res) => {
    const id = req.params.id;
    const { user, text, date, rating } = req.body;
    if (!user || !text) {
      return res.status(400).json({ error: "Missing user or text in request body" });
    }
    // Build the new comment object exactly as you want to store it
    const newComment = {
      user: user,
      text: text,
      date: date || new Date().toISOString().slice(0, 10), // default to today if not provided
      rating: rating || null,                               // optional rating field
    };
    try {
      const recipeRef = doc(db, "recipes", id);
      await updateDoc(recipeRef, {
        comments: arrayUnion(newComment),
      });
      return res.json({ message: "Comment added successfully", comment: newComment });
    } catch (err) {
      console.error("Error adding comment:", err);
      return res.status(500).json({ error: "Failed to add comment" });
    }
  });


  router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      // Reference the recipe document
      const recipeRef = doc(db, "recipes", id);
      const snap = await getDoc(recipeRef);
      if (!snap.exists()) {
        return res.status(404).json({ error: `Recipe with ID ${id} not found.` });
      }
      // Extract the comments field (or default to an empty array)
      const data = snap.data();
      const comments = Array.isArray(data.comments) ? data.comments : [];
      return res.json({ comments });
    } catch (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

export default router;

