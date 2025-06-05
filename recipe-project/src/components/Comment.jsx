// src/components/Comment.jsx
import { useState } from "react";
import "../styles/Comment.css";
import { BiUpvote } from "react-icons/bi";
import axios from "axios";

export default function Comment({
  index, // <-- now you can read the index value here
  user,
  rating,
  text,
  votes,
  recipeId,
}) {
  const [upvotes, setUpvotes] = useState(votes)
  const [upvoted, setUpvoted] = useState(false);
  const handleUpvote = async () => {
    if (!upvoted) {
      setUpvoted(true);
      try {
        await axios.put(
          `http://localhost:5050/comment/upvote?id=${recipeId}&index=${index}`
        );
        setUpvotes((prev) => prev + 1); 

      } catch (error) {
        console.error("Error upvoting comment:", error);
        // Optionally revert the optimistic update or show an error message
      }
    }
  };
  return (
    <div className="comment-box">
      <div className="comment-header">
        <span className="comment-user">{user}</span>
        <span className="comment-rating">Rating: {rating}</span>
        <span className="comment-rating">
          Upvotes: {upvotes}
          <button className="upvote-btn" onClick={handleUpvote}>
            <BiUpvote />
          </button>
        </span>
      </div>
      <p className="comment-text">{text}</p>
    </div>
  );
}
