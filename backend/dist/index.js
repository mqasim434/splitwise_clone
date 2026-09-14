"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const routes_1 = __importDefault(require("./routes"));
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/api", routes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map