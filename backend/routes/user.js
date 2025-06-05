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

// GET /api/users/:uid/createdRecipes
router.get('/:uid/createdRecipes', async (req, res) => {
  const uid = req.params.uid;
  try {
    // Step 1: Fetch the user document
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recipeIds = userDoc.data().createdRecipes || [];

    // Step 2: Fetch all recipes in parallel using the recipe IDs
    const recipePromises = recipeIds.map(async (id) => {
      const recipeDoc = await getDoc(doc(db, 'recipes', id));
      if (recipeDoc.exists()) {
        return { id: recipeDoc.id, ...recipeDoc.data() };
      }
      return null; // Handle non-existing recipe
    });

    const recipes = await Promise.all(recipePromises);

    // Filter out any nulls (e.g. deleted/missing recipes)
    const validRecipes = recipes.filter(recipe => recipe !== null);

    // Step 3: Send the full recipe data back to the client
    res.json(validRecipes);
  } catch (err) {
    console.error('Error fetching created recipes:', err);
    res.status(500).json({ error: 'Failed to fetch created recipes.' });
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
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// POST /api/users/:uid/saveRecipe
router.post('/:uid/saveRecipe', async (req, res) => {
  const { uid } = req.params;
  const { recipe, source } = req.body; // source = 'edamam' or 'community'

  try {
    const savedRef = collection(db, 'users', uid, 'savedRecipes');

    await addDoc(savedRef, {
      ...recipe,
      source,
      savedAt: new Date()
    });

    res.status(200).json({ message: 'Recipe saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save recipe' });
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
    res.status(200).json({ success: 'Successfully approved recipe' })

  } catch (err) {
    console.error('Error approving chosen recipe:', err);
    res.status(500).json({ error: 'Failed to approve recipe' });
  }
});



module.exports = router;
