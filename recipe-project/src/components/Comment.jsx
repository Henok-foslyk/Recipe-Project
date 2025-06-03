// src/components/Comment.jsx
import React from "react";
import "./Comment.css";

export default function Comment({ user = "User XYZ", rating = "4.5/5", text = "“This recipe was amazing...”" }) {
  return (
    <div className="comment-box">
      <div className="comment-header">
        <span className="comment-user">{user}</span>
        <span className="comment-rating">Rating: {rating}</span>
      </div>
      <p className="comment-text">{text}</p>
    </div>
  );
}
