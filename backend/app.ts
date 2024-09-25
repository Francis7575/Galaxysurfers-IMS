import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import * as path from "path";
import { Request, Response, NextFunction } from "express";
import usersRoute from "./routes/usersRoutes";
import warehousesRoute from "./routes/warehousesRoutes";
import itemsRoute from "./routes/itemsRoutes";
import inventoryRoute from "./routes/inventoryRoutes";

dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL

// CORS options
const corsOptions = {
  origin: FRONTEND_URL, // Allow requests from this origin
  credentials: true, // Enable cookies to be sent and received
  optionsSuccessStatus: 200, // For older browsers
};

// Use CORS middleware with options
app.use(cors(corsOptions));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL!);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Combine headers
  next();
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

app.use("/users", usersRoute);
app.use("/warehouses", warehousesRoute);
app.use("/items", itemsRoute);
app.use("/inventory", inventoryRoute);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("*", (req: Request, res: Response) => {
  const indexPath = path.join(
    __dirname,
    "../frontend/dist",
    "index.html"
  );
  console.log("server path:", indexPath);
  res.status(200).sendFile(indexPath);
});


export default app