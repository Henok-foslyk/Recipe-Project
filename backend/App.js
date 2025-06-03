const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const axios = require("axios");


// import recipeRoutes from './routes/recipe.js';
// import userRoutes from './routes/user.js';
// import chatRoutes from './routes/chatbot.js';
dotenv.config();

const app = express();
// const cors = require("cors");
const port = 5050;

require("dotenv").config();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const recipesRouter = require("./routes/recipe.js");  //my recipe router
const usersRouter = require("./routes/user.js");

app.use("/recipes", recipesRouter);
app.use("/users", usersRouter);

app.use(
  express.json({
    limit: "20mb",
  })
);
app.use(
  express.urlencoded({
    limit: "20mb",
    extended: true,
  })
);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

});


// const port = process.env.PORT || 5001;

// const app_id = process.env.APP_ID;
// const app_key = process.env.API_KEY;
// app.use(bodyParser.json());
// app.use(cors({
//   origin: "http://localhost:5173"     // ← allow your React app’s origin
//   // or use origin: "*"  to allow all origins during dev
// }));
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // API routes
// app.use('/api/recipes', recipeRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/chatbot', chatRoutes);

// //access point: https://api.edamam.com/api/recipes/v2
// const url = `https://api.edimam.com/api.recipes/v2?type=public&app_id=${app_id}&app_key=${app_key}`;

// app.listen(port, () => {
//   console.log(`App listening on port ${port}...`);

// 
