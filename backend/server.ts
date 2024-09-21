import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;
// CORS options
const corsOptions = {
  origin: FRONTEND_URL, // Allow requests from this origin
  credentials: true, // Enable cookies to be sent and received
  optionsSuccessStatus: 200, // For older browsers
};

// Use CORS middleware with options
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL!);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Combine headers
  next();
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

// Routes
import usersRoute from "./routes/usersRoutes";
app.use("/users", usersRoute);

import warehousesRoute from "./routes/warehousesRoutes";
app.use("/warehouses", warehousesRoute);

import itemsRoute from "./routes/itemsRoutes";
app.use("/items", itemsRoute);

import inventoryRoute from "./routes/inventoryRoutes";
app.use("/inventory", inventoryRoute);

app.use(express.static(path.join(__dirname, '../../..', 'frontend', 'dist')));

app.get('*', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../../..', 'frontend', 'dist', 'index.html'));
});

// Start the server
const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
