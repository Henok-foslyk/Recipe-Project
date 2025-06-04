const express = require('express');
const { db } = require('../firebase.js');
const { collection, getDocs, doc, deleteDoc } = require('firebase/firestore');

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

//function to receive all unapproved recipes for each admin user
// GET /api/users/recipes/unapproved
router.get('/recipes/unapproved', async (req, res) => {
  try {
    const querySnap = await db.collection('recipes').where('isApproved', '==', false).get();

    const unapprovedRecipes = querySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(unapprovedRecipes);
  } catch (err) {
    console.error('Error fetching unapproved recipes:', err);
    res.status(500).json({ error: 'Failed to fetch unapproved recipes' });
  }
});

router.patch('/recipes/approveRequest/:rid', async (req, res) => {
  try {
    const recipeId = req.params.rid;

    await db.collection('recipes').doc(recipeId).update({
      isApproved: true
    });
    res.status(200).json({success: 'Successfully approved recipe'})
    
  } catch (err) {
    console.error('Error approving chosen recipe:', err);
    res.status(500).json({ error: 'Failed to approve recipe' });
  }
});


module.exports = router;
