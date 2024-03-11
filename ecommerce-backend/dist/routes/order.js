import express from 'express';
import { newOrder } from '../controllers/order.js';
const app = express.Router();
// new User /api/v1/user/new
app.post("/new", newOrder);
export default app;
