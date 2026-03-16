import express from "express";
import dotenv from "dotenv";
import authRoutes from "./Route/authRoutes.js";
import userRoutes from "./Route/userRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/login", authRoutes);
app.use("/users", userRoutes);

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));