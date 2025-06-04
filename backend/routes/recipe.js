
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
    const health = req.query.health;
    const cuisineType = req.query.cuisineType;

    //we need one else we can't bring anything up
    if (!q && !mealType && !diet && !health && !cuisineType) {
        return res.status(400).json({ error: 'At least one search parameter ("q", "mealType","cuisine" ,"health" or "diet") is required.' });
    }


    //getting 30 recipes but returns 20 random ones

    try {
        const params = {
            type: 'public',
            q: q || 'recipe',
            app_id: APP_ID,
            app_key: APP_KEY,
            from: 0,
            to: 30,
        };

        //if mealType, health, cuisine or diet, shows those params
        if (mealType) params.mealType = mealType;
        if (diet) params.diet = diet;
        if (health) params.health = health;
        if (cuisineType) params.cuisineType = cuisineType;


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


