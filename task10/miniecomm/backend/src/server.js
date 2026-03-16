import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes    from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes   from "./routes/orders.routes.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);

app.get("/", (_, res) => res.json({ message: "Mongol Shop API ажиллаж байна 🚀" }));

app.listen(PORT, () => console.log(`✅ Server: http://localhost:${PORT}`));
