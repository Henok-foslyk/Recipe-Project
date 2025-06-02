import React from "react";
import "../styles/recipe.css";
import Navbar from "../components/Navbar";
import Skeleton from 'react-loading-skeleton';
import { useEffect, useState } from "react";


export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);


  return (
    <>
      <Navbar />

      <div className="recipe-container">
        This is the recipes page
        <div class="recipe-grid">
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
        </div>
        <Skeleton height={20} width={200} />
      </div>
    </>
  )
}
