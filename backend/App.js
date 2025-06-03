import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import recipeRoutes from './routes/recipe.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chatbot.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

const app_id = process.env.APP_ID;
const app_key = process.env.API_KEY;
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:5173"     // ← allow your React app’s origin
  // or use origin: "*"  to allow all origins during dev
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatRoutes);

//access point: https://api.edamam.com/api/recipes/v2
const url = `https://api.edimam.com/api.recipes/v2?type=public&app_id=${app_id}&app_key=${app_key}`;

app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});
