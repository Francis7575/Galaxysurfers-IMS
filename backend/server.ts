import { Request, Response } from "express";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

app.get("/test", (req: Request, res: Response) => {
  console.log("hello world")
});

const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});