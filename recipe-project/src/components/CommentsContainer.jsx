// src/components/CommentsContainer.jsx
import React from "react";
import Comment from "./Comment";
import "./CommentsContainer.css";
import "./RecipeDetails.css"
export default function CommentsContainer({ comments = [] }) {
  const mockComments = [
    {
      user: "Alicia R.",
      rating: "5/5",
      text: "“Absolutely loved this! Flavor was incredible and super easy to follow.”",
    },
    {
      user: "Marcus T.",
      rating: "4/5",
      text: "“Really tasty recipe. I would add a bit more spice next time, but my family devoured it.”",
    },
    {
      user: "Sophia L.",
      rating: "3.5/5",
      text: "“Good overall, but found it a little salty for my taste. I’d reduce the salt by ¼ tsp.”",
    },
    {
      user: "David K.",
      rating: "4.5/5",
      text: "“One of the best sandwiches I’ve made at home. The ingredients are simple yet so satisfying.”",
    },
    {
      user: "Emily S.",
      rating: "5/5",
      text: "“My vegetarian friends even raved about it after I swapped beef for veggie crumbles. Amazing!”",
    },
    {
      user: "Ravi P.",
      rating: "4/5",
      text: "“Great texture and spice balance. I grilled the sandwich instead of pan-frying—loved the crisp.”",
    },
    {
      user: "Yuna M.",
      rating: "4/5",
      text: "“Super easy for a weeknight meal. Next time I’ll try homemade aioli instead of store-bought.”",
    },
    {
      user: "Carlos G.",
      rating: "3/5",
      text: "“It was okay but a bit too greasy for me. Might try lean turkey next time.”",
    },
    {
      user: "Hannah B.",
      rating: "5/5",
      text: "“Kids went crazy for this! Will definitely be in our regular dinner rotation.”",
    },
    {
      user: "Joshua W.",
      rating: "4/5",
      text: "“Turned out great—added some sliced avocado on top for extra creaminess.”",
    },{
        user: "Carlos G.",
        rating: "3/5",
        text: "“It was okay but a bit too greasy for me. Might try lean turkey next time.”",
      },
      {
        user: "Hannah B.",
        rating: "5/5",
        text: "“Kids went crazy for this! Will definitely be in our regular dinner rotation.”",
      },
      {
        user: "Joshua W.",
        rating: "4/5",
        text: "“Turned out great—added some sliced avocado on top for extra creaminess.”",
      },{
        user: "Carlos G.",
        rating: "3/5",
        text: "“It was okay but a bit too greasy for me. Might try lean turkey next time.”",
      },
      {
        user: "Hannah B.",
        rating: "5/5",
        text: "“Kids went crazy for this! Will definitely be in our regular dinner rotation.”",
      },
      {
        user: "Joshua W.",
        rating: "4/5",
        text: "“Turned out great—added some sliced avocado on top for extra creaminess.”",
      },{
        user: "Carlos G.",
        rating: "3/5",
        text: "“It was okay but a bit too greasy for me. Might try lean turkey next time.”",
      },
      {
        user: "Hannah B.",
        rating: "5/5",
        text: "“Kids went crazy for this! Will definitely be in our regular dinner rotation.”",
      },
      {
        user: "Joshua W.",
        rating: "4/5",
        text: "“Turned out great—added some sliced avocado on top for extra creaminess.”",
      },{
        user: "Carlos G.",
        rating: "3/5",
        text: "“It was okay but a bit too greasy for me. Might try lean turkey next time.”",
      },
      {
        user: "Hannah B.",
        rating: "5/5",
        text: "“Kids went crazy for this! Will definitely be in our regular dinner rotation.”",
      },
      {
        user: "Joshua W.",
        rating: "4/5",
        text: "“Turned out great—added some sliced avocado on top for extra creaminess.”",
      },
  ];
  return (
    <div className="cards-wrapper">
      <div className="comments-container">
        <div className="comments-inner">
          {mockComments.length === 0 ? (
            <p className="no-comments">No comments yet.</p>
          ) : (
            mockComments.map((c, idx) => (
              <Comment
                key={idx}
                user={c.user}
                rating={c.rating}
                text={c.text}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
