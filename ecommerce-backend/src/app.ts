import express from 'express';
import userRoute from './routes/user.js';
import productRoute from './routes/product.js';

import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from 'node-cache';


const app = express();
app.use(express.json());
const PORT = 4000;
connectDB();

export const myCache = new NodeCache();

app.get("/",(req,res)=>{
    res.send("API Working with /api/v1");
})

// Using routes
app.use("/api/v1/user",userRoute);
app.use("/api/v1/product",productRoute);
app.use("/uploads",express.static("uploads")); // declared upload folder as static
app.use(errorMiddleware);

app.listen(PORT,()=>{console.log(`Express running on http://localhost:${PORT}`)})