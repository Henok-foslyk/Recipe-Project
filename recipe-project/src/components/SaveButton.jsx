import React from 'react';
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import fallbackImage from '../assets/fallbackImage.jpg';

import { toast } from "react-toastify";

const SaveButton = ({ recipe}) => {

    //handling when a user wants to save a recipe
    const userSaves = async () => {
        console.log("Saving...");
        if (!user) {
            toast.error("Must be signed in to save recipes.");
            return;
        }

        try {
            const saveMeal = collection(db, 'users', user.uid, "savedRecipes");
            await addDoc(saveMeal, {
                name: recipe.name,
                img: recipe.image || recipe.imgUrl || fallbackImage,
                mealType: recipe.mealType,
                dietLabels: recipe.dietLabels,
                cuisineType: recipe.cuisineType,
                recipeId: recipe.uri || recipe.id || "",
                url: recipe.url,
                source: recipe.source || "community",
            });

            toast.success('The recipe has been saved successfully');
        } catch (error) {
            console.log('Error saving recipe, try again!', error);
            toast.error("Failed to save recipe");
        }
    };

    return <button className="saveB" onClick={userSaves}>Save </button>
};

export default SaveButton