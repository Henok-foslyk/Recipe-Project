const express = require('express');
const { db } = require('../firebase.js');
const { collection, getDocs, doc, deleteDoc, addDoc } = require('firebase/firestore');

const router = express.Router();

// ✅ POST /users/signin – handles login by checking Firestore for username/password
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const snapshot = await db.collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();
    if (snapshot.empty) {
      return res.status(401).json({ message: "User not found" });
    }
    const userDoc = snapshot.docs[0];
    let userData = userDoc.data();

    userData = {...userData, "id": userDoc.id};
    
    if (userData.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Don't return the password
    const safeUserData = {
      id: userDoc.id,       // or use `uid: userDoc.id` if you prefer
      ...userData,
    };
    delete safeUserData.password;
    res.status(200).json(safeUserData);
  } catch (err) {
    console.error("Error during signin:", err);
    res.status(500).json({ error: "Something went wrong during signin" });
  }
});


router.post('/seed', async (req, res) => {
  try {
    const docRef = await db.collection("users").add(req.body);
    const savedPost = { id: docRef.id, ...req.body };
    res.status(200).json(savedPost);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch created new user' });
  }
});

// GET /user/:id – get a single user by ID or uid whichever one u want.
router.get('/redundant/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const doc = await db.collection('users').doc(userId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET /api/user/:uid
router.get('/:uid', async (req, res) => {
  const uid = req.params.uid;

  try {
    // 1) Get reference to the user document
    const docRef = db.collection('users').doc(uid);

    // 2) Fetch the document snapshot
    const docSnap = await docRef.get();

    // 3) If it doesn’t exist, return 404
    if (!docSnap.exists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // 4) Get the data and respond
    const data = docSnap.data();
    const createdRecipes = data.createdRecipe || [];
    const savedRecipes = data.savedRecipe || [];

    return res.json({ createdRecipes, savedRecipes });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Failed to fetch user data.' });
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

//function to receive all approved recipes 
router.get('/recipes/approved', async (req, res) => {
  try {
    const querySnap = await db.collection('recipes').where('isApproved', '==', true).get();

    const approvedRecipes = querySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(approvedRecipes);
  } catch (err) {
    console.error('Error fetching approved recipes:', err);
    res.status(500).json({ error: 'Failed to fetch approved recipes' });
  }
});


router.patch('/recipes/approveRequest/:rid', async (req, res) => {
  try {
    const recipeId = req.params.rid;

    await db.collection('recipes').doc(recipeId).update({
      isApproved: true
    });
    res.status(200).json({ success: 'Successfully approved recipe' })

  } catch (err) {
    console.error('Error approving chosen recipe:', err);
    res.status(500).json({ error: 'Failed to approve recipe' });
  }
});



module.exports = router;
