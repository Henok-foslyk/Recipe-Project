// src/components/CommentsContainer.jsx
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import "../styles/CommentsContainer.css";
import axios from "axios";

export default function CommentsContainer({ recipeId, initialComments}) {
  // 1) Stateful list of comments
  const [comments, setComments] = useState(initialComments);

  // 2) Control whether the “Add Comment” modal is visible
  const [showModal, setShowModal] = useState(false);

  // 3) Form‐field state inside the modal
  const [newUser, setNewUser] = useState("");
  const [newRating, setNewRating] = useState("5");
  const [newText, setNewText] = useState("");

  useEffect(() => {}, []);

  // 4) Handler to submit a brand‐new comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newUser.trim() || !newText.trim()) {
      alert("Please enter your name and comment text.");
      return;
    }

    // Build the new comment object
    const newComment = {
      user: newUser.trim(),
      rating: `${newRating}/5`,
      text: newText.trim(),
      date: new Date().toISOString().slice(0, 10),
      upvotes: 0, // Start with 0 upvotes
    };

    // Optimistically update local state so the user sees it immediately
    setComments((prev) => [...prev, newComment]);

    try {
      // 5) Call backend: POST to /api/comments/:recipeId
      await axios.post(
        `http://localhost:5050/comment?id=${recipeId}`,
        newComment
      );
    } catch (error) {
      console.error("Error adding comment:", error);
      // Optionally remove the optimistic update or show an error banner
    }

    // 6) Reset form and close modal
    setNewUser("");
    setNewRating("5");
    setNewText("");
    setShowModal(false);
  };

  return (
    <div className="comments-container">
      {/* HEADER WITH “Reviews” TITLE + ADD BUTTON */}
      <div className="comments-header">
        <h2>Reviews</h2>
        <button className="add-comment-btn" onClick={() => setShowModal(true)}>
          + Add Comment
        </button>
      </div>

      {/* SCROLLABLE LIST OF COMMENTS */}
      <div className="comments-inner">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet.</p>
        ) : (
          comments.map((c, idx) => (
            <Comment key={idx} index={idx} user={c.user} rating={c.rating} text={c.text} votes={c.upvotes} recipeId={recipeId}/>
          ))
        )}
      </div>

      {/* MODAL POPUP FOR ADDING NEW COMMENT */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Your Review</h3>
            <form onSubmit={handleAddComment} className="modal-form">
              <label>
                Name
                <input
                  type="text"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  placeholder="Your name"
                />
              </label>

              <label>
                Rating (1–5)
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Comment
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Write your review..."
                />
              </label>

              <div className="modal-buttons">
                <button type="submit" className="modal-submit">
                  Submit
                </button>
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
