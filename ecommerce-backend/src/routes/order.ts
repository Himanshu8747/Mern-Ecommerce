import express from 'express';
import { adminOnly } from '../middlewares/auth.js';
import { myOrders, newOrder, allOrders, getSingleOrder } from '../controllers/order.js';

const app = express.Router();

// new User /api/v1/user/new
app.post("/new",newOrder);

app.get("/my",myOrders);


app.get("/all",adminOnly,allOrders);

app.route("/:id").get(getSingleOrder);




export default app;