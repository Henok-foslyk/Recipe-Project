import express from 'express';
import { db } from '../firebase.js';
import { doc, deleteDoc } from 'firebase/firestore';

const router = express.Router();

// DELETE /api/recipes/:id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await deleteDoc(doc(db, 'recipes', id));
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

export default router;
