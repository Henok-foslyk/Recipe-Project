import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../firebase';
import {
    collection,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    addDoc,
    getDoc,
} from "firebase/firestore";
import fallbackImage from '../assets/fallbackImage.jpg';

import { useAuth } from '../AuthContext';

// clean recipe ID to use as firestore;s docid which doesnt include again special symbols
const cleanRecipeId = (id) => {
    if (!id) return null;
    if (id.includes('#')) {
        return id.split('#')[1];
    }
    return id.replace(/\//g, '_');
};


const SaveButton = ({ recipeId, recipe }) => {
    const { currentUser } = useAuth(); //curr user logged in

    //we will track the username of the person logged in, makes it easier
    const userSaves = async () => {
        if (!currentUser?.username) {
            toast.error("You must be signed in to save recipes.");

            return;
        }
        try {

            // we then get user from the users collection by username
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", currentUser.username));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                toast.error("Sorry, there is no such user in our records.");
                return;
            }

            const userDoc = querySnapshot.docs[0];
            const userDocRef = userDoc.ref;

            // cleaned doc ids either for edamam or commuity
            const rawId = recipeId || recipe?.recipeId || recipe?.uri || null;
            if (!rawId) {
                toast.error("No recipe ID provided.");
                return;
            }
            const cleanedId = cleanRecipeId(rawId);

            // Building the recipe data object - choosing what we store and show
            const isEdamam = recipe?.url?.includes("edamam") || recipe?.recipeId || recipe?.uri;
            const recipeData = isEdamam
                ? {
                    recipeId: rawId,
                    title: recipe.title || recipe.name || "",
                    cuisineType: recipe.cuisineType || [],
                    dietLabels: recipe.dietLabels || [],
                    img: recipe.image || recipe.img || fallbackImage,
                    mealType: recipe.mealType || [],
                    url: recipe.url || "",
                    source: "edamam",
                }
                : {
                    recipeId: rawId,
                    title: recipe.title || recipe.name || "",
                    img: recipe.img || fallbackImage,
                    cuisineType: recipe.cuisineType || [],
                    source: "community",
                };

            // now lets save the recipes to the recipes collection
            const recipeDocRef = doc(db, "recipes", cleanedId);
            await setDoc(recipeDocRef, recipeData, { merge: true });

            //then save the recipe to user's 'savedRecipes' subcollection
            const savedRecipesColRef = collection(userDocRef, "savedRecipes");

            //check if recipe already saved to avoid duplicates
            const savedRecipeDocRef = doc(savedRecipesColRef, cleanedId);
            const savedRecipeDocSnap = await getDoc(savedRecipeDocRef);

            if (!savedRecipeDocSnap.exists()) {
                await setDoc(savedRecipeDocRef, recipeData);
            } else {
                toast.info("Recipe already saved in your collection.");
                return;
            }

            toast.success("Recipe saved successfully!");
        } catch (error) {
            console.error("Error saving recipe:", error);
            toast.error("Failed to save recipe.");
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <button className="saveB" onClick={userSaves}>Save</button>
        </>
    );

};

export default SaveButton;
