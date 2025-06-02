import express from 'express';
import { db } from '../firebase.js';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const router = express.Router();

// GET /api/users/:uid/createdRecipes
router.get('/:uid/createdRecipes', async (req, res) => {
  const uid = req.params.uid;
  try {
    const querySnap = await getDocs(collection(db, 'users', uid, 'createdRecipes'));
    const recipes = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch created recipes' });
  }
});

// GET /api/users/:uid/savedRecipes
router.get('/:uid/savedRecipes', async (req, res) => {
  const uid = req.params.uid;
  try {
    const querySnap = await getDocs(collection(db, 'users', uid, 'savedRecipes'));
    const recipes = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved recipes' });
  }
});

// DELETE /api/users/:uid/savedRecipes/:id
router.delete('/:uid/savedRecipes/:id', async (req, res) => {
  const { uid, id } = req.params;
  try {
    await deleteDoc(doc(db, 'users', uid, 'savedRecipes', id));
    res.json({ message: 'Recipe removed from saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove saved recipe' });
  }
});

export default router;
