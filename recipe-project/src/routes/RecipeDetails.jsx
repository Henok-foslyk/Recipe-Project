// src/pages/RecipeDetails.jsx
import { useState, useEffect } from "react";
import DisplayRecipe from "../components/DisplayRecipe";
import "../components/RecipeDetails.css"; // ← import the wrapper’s CSS
import CommentsContainer from "../components/CommentsContainer";
import ChatContainer from "../components/ChatContainer";
import { useParams } from "react-router-dom"; // ← import useParams
import Navbar from "../components/Navbar";
import Switch from "@mui/material/Switch";
import { Typography, Box } from "@mui/material";

export default function RecipeDetails() {
  const { id } = useParams();
  const [review, setReview] = useState(true);
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOne = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5050/firebase-recipes?id=${id}`);
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
    }
  }, [id]);

  if (loading) return <p>Loading recipe…</p>;
  if (!recipeData) return <p>Recipe not found.</p>;
  return (
    <>
    <Navbar />
    <div className="cards-wrapper">
      <div>
      <h1 style={{ color: "black", textAlign: "left"}}>Recipe Details</h1>
        <DisplayRecipe
          imageUrl={recipeData.imgUrl || "/fallback-image.jpg"}
          title={recipeData.name}
          caution={recipeData.allergens?.join(", ")}
          ingredients={recipeData.ingredients || []}
          instructions={recipeData.instructions || []}
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
        {review ? <CommentsContainer recipeId={id} initialComments={recipeData.comments}/> : <ChatContainer recipe={recipeData} />}
      </div>
    </div>
    </>
  );
}
