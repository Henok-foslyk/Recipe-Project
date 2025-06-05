// src/pages/RecipeDetails.jsx
import { useState, useEffect } from "react";
import DisplayRecipe from "../components/DisplayRecipe";
import "../styles/RecipeDetails.css"; // ← import the wrapper’s CSS
import CommentsContainer from "../components/CommentsContainer";
import ChatContainer from "../components/ChatContainer";
import { useParams } from "react-router-dom"; // ← import useParams
import Navbar from "../components/Navbar";
import Switch from "@mui/material/Switch";
import { Typography, Box } from "@mui/material";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
export default function RecipeDetails() {
  const { id } = useParams();
  const [review, setReview] = useState(true);
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false); // Track if the recipe is saved
  const { currentUser } = useAuth();
  const checkIfSaved = async () => {
    if (!currentUser) return; // If no user is logged in, exit early
    try {
      const response = await axios.get(
        `http://localhost:5050/firebase-recipes/check-saved?userId=${currentUser.id}&recipeId=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Check saved response:", response.data);
      setIsSaved(response.data.isSaved); // Update state based on response
    } catch (e) {
      console.error("Error checking if recipe is saved:", e);
      alert("Failed to check if recipe is saved. Please try again later.");
    }
  };
  const saveRecipe = async () => {
    try {
      console.log("Current User: ", currentUser);
      const response = await axios.put(
        `http://localhost:5050/firebase-recipes/save?userId=${currentUser.id}&recipeId=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      alert("Recipe saved successfully!");
      setIsSaved(true); // Update state to reflect that the recipe is saved
    } catch (e) {
      console.error("Error saving recipe:", e);
      alert("Failed to save recipe. Please try again later.");
    }
  };
  const deleteRecipe = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5050/firebase-recipes/delete?userId=${currentUser.id}&recipeId=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      alert("Recipe removed from saved list.");
      setIsSaved(false); // Update state to reflect that the recipe is no longer saved
    } catch (e) {
      console.error("Error deleting recipe:", e);
      alert("Failed to remove recipe. Please try again later.");
    }
  };
  useEffect(() => {
    const fetchOne = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5050/firebase-recipes?id=${id}`
        );
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setRecipeData(data); // your backend already returns { id: "...", ...fields }
      } catch (e) {
        console.error("Error fetching recipe:", e);
        setRecipeData(null);
      }
      setLoading(false);
    };

    if (id) {
      fetchOne();
      checkIfSaved();
    }
  }, [id]);

  if (loading) return <p>Loading recipe…</p>;
  if (!recipeData) return <p>Recipe not found.</p>;
  return (
    <>
      <Navbar />
      <div className="cards-wrapper">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 style={{ color: "black", margin: 0 }}>Recipe Details</h1>
            <button
              onClick={isSaved ? deleteRecipe : saveRecipe}

            >
              {isSaved ? (
                <IoBookmark size={24} />
              ) : (
                <IoBookmarkOutline size={24} />
              )}
            </button>
          </div>

          <DisplayRecipe
            imageUrl={recipeData.imgUrl || "/fallback-image.jpg"}
            title={recipeData.name}
            caution={recipeData.healthLabels?.join(", ")}
            ingredients={recipeData.ingredients || []}
            instructions={recipeData.instructions || []}
            mealType={recipeData.mealType?.join(", ")}
            cuisineType={recipeData.cuisineType?.join(", ")}
          />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1>{review ? "Reviews" : "AI-Assistance"}</h1>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1} // small space between items
            >
              {/* Left‐side label */}
              <Typography
                variant="body1"
                sx={{ color: !review ? "black" : "text.disabled" }}
              >
                Reviews
              </Typography>

              {/* The Switch itself */}
              <Switch
                checked={!review}
                onChange={() => setReview((prev) => !prev)}
                size="medium"
              />

              {/* Right‐side label */}
              <Typography
                variant="body1"
                sx={{ color: !review ? "black" : "text.disabled" }}
              >
                AI-Assistance
              </Typography>
            </Box>
          </div>
          {review ? (
            <CommentsContainer
              recipeId={id}
              initialComments={recipeData.comments}
            />
          ) : (
            <ChatContainer recipe={recipeData} />
          )}
        </div>
      </div>
    </>
  );
}
