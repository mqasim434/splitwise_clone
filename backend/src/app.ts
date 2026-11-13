import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import { notFound, errorHandler } from "./middlewares/error.middleware";

const app = express();

// Nginx sits in front of the app, so trust one proxy hop.
// Express then sees real client IPs and the original protocol.
app.set("trust proxy", 1);

// safe security headers, and removes the X-Powered-By: Express header
app.use(helmet());

// which websites may call this API from a browser
const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : process.env.NODE_ENV !== "production",
  })
);

app.use(express.json({ limit: "100kb" }));

// slows down password guessing on login and register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" },
});
app.use("/api/auth", authLimiter);

app.use("/api", routes);

// these two must stay last
app.use(notFound);
app.use(errorHandler);

export default app;