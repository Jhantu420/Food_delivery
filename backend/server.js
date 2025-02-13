// Import dotenv to load environment variables
import dotenv from 'dotenv';
dotenv.config();  // Load environment variables from the .env file

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// app config
const app = express();
const port = process.env.PORT || 4000 ;

// middleware
app.use(express.json()); // this will allow us to parse json
app.use(cors()); // this will allow us to make requests from any origin

// db config
connectDB();
// api endpoints
app.use("/api/food",foodRouter);
app.use("/images",express.static("uploads"));
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);

// Routes
app.get("/", (req, res) => res.status(200).send("Hello World"));

// Start the server
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
