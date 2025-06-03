
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const router = express.Router();


//from .env
const APP_ID = process.env.RECIPE_APP_ID;
const APP_KEY = process.env.RECIPE_API_KEY;


//get from API
router.get('/', async (req, res) => {
    const pull = req.query.pull || 'edamam';

    if (pull !== 'edamam') {
        return res.status(400).json({ error: "Invalid source requested" });
    }

    //using query or these two filters
    const q = req.query.q || '';
    const mealType = req.query.mealType;
    const diet = req.query.diet;

    //we need one else we can't bring anything up
    if (!q && !mealType && !diet) {
        return res.status(400).json({ error: 'At least one search parameter ("q", "mealType", or "diet") is required.' });
    }


    //getting 50 recipes

    try {
        const params = {
            type: 'public',
            q: q || 'recipe',
            app_id: APP_ID,
            app_key: APP_KEY,
            from: 0,
            to: 60,
        };

        //if mealType or diet, shows those params
        if (mealType) params.mealType = mealType;
        if (diet) params.diet = diet;

        //url from site
        const url = 'https://api.edamam.com/api/recipes/v2';

        //make sure to add header for all calls
        const response = await axios.get(url, {
            params,
            headers: {
                'Edamam-Account-User': process.env.RECIPE_USER_ID,  
            }
        });

        return res.json({ hits: response.data.hits }); //hits the frontend and shows what the user is askng for
    } catch (error) {
        console.error('Failed to fetch from Edamam:', error.response?.data || error.message); //troubleshoot logs
        return res.status(500).json({ error: 'Failed to fetch recipes from Edamam' });
    }
});

module.exports = router;








//     }

// router.get("/", async (req, res) => {
//     const query = req.query.q;

//     if (!query) {
//         return res.status(400).json({ error: "Missing search query" });
//     }

//     try {
//         const params = {
//             q: query,
//             app_id: APP_ID,
//             app_key: APP_KEY,
//             from: 0,
//             to: 40,
//         };

//         // Optional filters - if present in req.query, add to params
//         // These can be arrays or single strings
//         const filterKeys = ["mealType", "diet", "health", "cuisineType", "dishType", "ingr", "beta"];

//         filterKeys.forEach((key) => {
//             if (req.query[key]) {
//                 // If the param is a comma-separated string from frontend, convert to array
//                 if (typeof req.query[key] === "string" && req.query[key].includes(",")) {
//                     params[key] = req.query[key].split(",");
//                 } else {
//                     params[key] = req.query[key];
//                 }
//             }
//         });

//         const response = await axios.get("https://api.edamam.com/api/recipes/v2", { params });


//         res.json(response.data);
//     } catch (err) {
//         console.error("Error fetching recipes:", err.message);
//         res.status(500).json({ error: "Failed to fetch recipes" });
//     }
// });

