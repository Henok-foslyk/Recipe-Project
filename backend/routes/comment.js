// routes/commentsRouter.js

const express = require('express');
const { db } = require('../firebase.js');
const { doc, updateDoc, arrayUnion, getDoc } = require('firebase/firestore');

const router = express.Router();

// POST /api/recipes/:id — add a comment
router.post('/:id', async (req, res) => {
  const id = req.params.id;
  const { user, text, date, rating } = req.body;
  if (!user || !text) {
    return res.status(400).json({ error: 'Missing user or text in request body' });
  }

  const newComment = {
    user,
    text,
    date: date || new Date().toISOString().slice(0, 10), // default to today if not provided
    rating: rating || null, // optional
  };

  try {
    const recipeRef = doc(db, 'recipes', id);
    await updateDoc(recipeRef, {
      comments: arrayUnion(newComment),
    });
    return res.json({ message: 'Comment added successfully', comment: newComment });
  } catch (err) {
    console.error('Error adding comment:', err);
    return res.status(500).json({ error: 'Failed to add comment' });
  }
});

// GET /api/recipes/:id — fetch all comments
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const recipeRef = doc(db, 'recipes', id);
    const snap = await getDoc(recipeRef);
    if (!snap.exists()) {
      return res.status(404).json({ error: `Recipe with ID ${id} not found.` });
    }
    const data = snap.data();
    const comments = Array.isArray(data.comments) ? data.comments : [];
    return res.json({ comments });
  } catch (err) {
    console.error('Error fetching comments:', err);
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

module.exports = router;
