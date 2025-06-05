import React from 'react';
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
// import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

const SaveButton = ({ recipe }) => {

    // const [user] = useAuthState(auth);

    //handling when a user wants to save a recipe
    const userSaves = async () => {
        console.log("Saving...");
        // if (!user) {
        //     toast.error("Must be signed in to save recipes.");
        //     return;
        // }

        try {
            const saveMeal = collection(db, "recipes");
            await addDoc(saveMeal, {
                img: recipe.image,
                mealType: recipe.mealType,
                dietLabels: recipe.dietLabels,
                cuisineType: recipe.cuisineType,
                recipeId: recipe.uri,
                // userId: user.uid,
                url: recipe.url,
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