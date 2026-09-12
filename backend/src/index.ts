const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});