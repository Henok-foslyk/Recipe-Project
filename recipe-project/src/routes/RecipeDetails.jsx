// src/pages/RecipeDetails.jsx
import { useState } from "react";
import DisplayRecipe from "../components/DisplayRecipe";
import "../components/RecipeDetails.css"; // ← import the wrapper’s CSS
import CommentsContainer from "../components/CommentsContainer";
import ChatContainer from "../components/ChatContainer";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Typography, Box } from "@mui/material";

export default function RecipeDetails({id}) {
  const [review, setReview] = useState(true);
  const mockRecipe = {
    name: "Fat Sandwich",
    description: "A delicious and hearty sandwich loaded with toppings.",
    isApproved: true,
    ingredients: ["Lettuce", "Ground Beef", "Tomatoes"],
    instructions: ["bleh blah blah", "cook it"],
    allergens: ["XYZ", "ABC", "ETC."],
    comments: [
      {
        user: "John Doe",
        text: "This sandwich is amazing!",
        date: "2023-10-01",
      },
      {
        user: "Jane Smith",
        text: "I love the combination of flavors.",
        date: "2023-10-02",
      },
    ],
    imageUrl:
      "https://images.pexels.com/photos/4692163/pexels-photo-4692163.jpeg",
    type: "saved",
  };

  // Example: hard‐coded recipeId; replace with actual ID from your data fetching
  const recipeId = "M4TXP57PiIuLcm0Oqlzg";
  return (
    <div className="cards-wrapper">
      <div>
        <h1>Recipe Details</h1>
        <DisplayRecipe
          imageUrl="https://images.pexels.com/photos/4692163/pexels-photo-4692163.jpeg"
          title="Fat Sandwich"
          caution="XYZ, ABC, ETC."
          ingredients={["Lettuce", "Ground Beef", "Tomatoes"]}
          instructions={["bleh blah blah", "cook it"]}
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
              color={!review ? "textPrimary" : "textDisabled"}
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
              color={review ? "textPrimary" : "textDisabled"}
            >
              AI-Assistance
            </Typography>
          </Box>
        </div>
        {review ? <CommentsContainer /> : <ChatContainer recipe={mockRecipe} />}
      </div>
      {/* <CommentsContainer /> */}
    </div>
  );
}
