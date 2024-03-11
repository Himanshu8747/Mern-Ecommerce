import express from 'express';
import { myOrders, newOrder } from '../controllers/order.js';
const app = express.Router();
// new User /api/v1/user/new
app.post("/new", newOrder);
app.get("/my", myOrders);
export default app;
