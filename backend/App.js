const express = require("express");
const app = express();
const cors = require("cors");
const port = 5050;
const axios = require("axios");
require("dotenv").config();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const recipesRouter = require("./routes/recipe.js");  //my recipe router
app.use("/recipes", recipesRouter);

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
