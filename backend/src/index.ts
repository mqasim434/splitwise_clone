const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
import routes from "./routes";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});