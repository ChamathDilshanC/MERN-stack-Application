import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { ConectToMongoDB } from "./db/mongo";
import { errorHandler } from "./middlewares/errorHandler";
import rootRouter from "./routes";

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"], // Fixed: array format
};

// Apply CORS before other middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // Parse cookies from request headers

const PORT = process.env.PORT;

// Routes should come after middleware setup
app.use("/api", rootRouter);
app.use(errorHandler);

ConectToMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
