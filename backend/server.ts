import { Request, Response } from "express";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

// Added on cron-job to ping the server every 10 mins to avoid the server sleep on render for inactivity
app.get("/test", (req: Request, res: Response) => {
  try {
    console.log("hello world");
    res.status(200).send("Test route working");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});