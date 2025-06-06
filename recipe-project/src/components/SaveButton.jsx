import React from 'react';
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import fallbackImage from '../assets/fallbackImage.jpg';
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import axios from "axios"
const SaveButton = ({recipeId}) => {
    const { currentUser } = useAuth();
    //handling when a user wants to save a recipe
    const userSaves = async () => {
        console.log("Saving...");
        if (!currentUser) {
            toast.error("Must be signed in to save recipes.");
            return;
        }
        try {
            console.log("Current User: ", currentUser);
            // Check if the recipe already exists in the user's saved recipes
            console.log("Recipe ID: ", recipeId);
            const response = await axios.put(
              `http://localhost:5050/firebase-recipes/save?userId=${currentUser.id}&recipeId=${recipeId}`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            console.log(response.data);
            setIsSaved(true); // Update state to reflect that the recipe is saved
          } catch (e) {
            console.error("Error saving recipe:", e);
          }
    };

    return <button className="saveB" onClick={userSaves}>Save</button>
};

export default SaveButton