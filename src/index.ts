// Third-party imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Custom imports
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import { authenticate } from "./middleware/authenticate";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Protected route example
app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    message: "Access granted 🎉",
    user: req.user,
  });
});

// Health check
app.get("/", (req, res) => {
  res.send("Server is up and running...");
});

// Health check
app.get("/health", (req, res) => {
  res.send("Ok");
});

// Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}. health-check route: /health`);
});