import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});