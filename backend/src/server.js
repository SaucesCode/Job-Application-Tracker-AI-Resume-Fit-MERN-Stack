import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
  });
});
