import React from 'react';
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

const SaveButton = ({ recipe }) => {
    const [user] = useAuthState(auth);

    //handling when a user wants to save a recipe
    const userSaves = async() => {
        if (!user) {
            toast.error("Must be signed in to save recipes.");
            return;
        }
    }
}




export default SaveButton