const express = require("express");
const app = express();
const cors = require("cors");
const port = 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    limit: "10mb",
  })
);
app.use(
  express.urlencoded({
    limit: "10mb",
    extended: true,
  })
);
