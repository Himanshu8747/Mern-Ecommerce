import express from 'express';
import userRoute from './routes/user.js';
import productRoute from './routes/product.js';
import orderRoute from './routes/order.js';
import paymentRoute from './routes/payment.js';
import dashboardRoute from './routes/stats.js';

import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from 'node-cache';
import { config } from 'dotenv';
import morgan from 'morgan';


const app = express();
config({
    path:"./.env",
})
app.use(express.json());
app.use(morgan("dev"));

const PORT =process.env.PORT ||4000;
const mongoURI = process.env.MONGO_URI || "";
connectDB();
export const myCache = new NodeCache();

app.get("/",(req,res)=>{
    res.send("API Working with /api/v1");
})

// Using routes
app.use("/api/v1/user",userRoute);
app.use("/api/v1/product",productRoute);
app.use("/api/v1/order",orderRoute);
app.use("/api/v1/payment",paymentRoute);
app.use("/api/v1/dashboard",dashboardRoute);

app.use("/uploads",express.static("uploads")); // declared upload folder as static
app.use(errorMiddleware);

app.listen(PORT,()=>{console.log(`Express running on http://localhost:${PORT}`)})