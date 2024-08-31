import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;
// CORS options
const corsOptions = {
  origin: FRONTEND_URL, // Allow requests from this origin
  credentials: true,    // Enable cookies to be sent and received
  optionsSuccessStatus: 200 // For older browsers
};

// Use CORS middleware with options
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Combine headers
  next();
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

// Routes
import usersRoute from './routes/usersRoutes.js';
app.use('/users', usersRoute);

import warehousesRoute from './routes/warehousesRoutes.js';
app.use('/warehouses', warehousesRoute);

import itemsRoute from './routes/itemsRoutes.js';
app.use('/items', itemsRoute);

import inventoryRoute from './routes/inventoryRoutes.js';
app.use('/inventory', inventoryRoute);

// Start the server
const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
