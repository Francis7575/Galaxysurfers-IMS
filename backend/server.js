import express from 'express'
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import usersRoute from './routes/usersRoutes.js'
import warehousesRoute  from './routes/warehousesRoutes.js'

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true, // important for cookies
  optionsSuccessStatus: 200 // for older browser support
};

// Middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

// Routes

app.use('/users', usersRoute);
app.use('/warehouses', warehousesRoute);

// Start the server
const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
