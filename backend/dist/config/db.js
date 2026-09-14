"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        const mongoConnectionString = process.env.MONGO_CONN_STRONG;
        if (!mongoConnectionString) {
            throw new Error("MONGO_CONN_STRONG is not defined");
        }
        const conn = await mongoose.connect(mongoConnectionString);
        if (conn) {
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
module.exports = connectDB;
//# sourceMappingURL=db.js.map