// coupon route as it will be used in payment

import express from 'express';
import { adminOnly } from '../middlewares/auth.js';
import { applyDiscount, deleteCoupon, getAllCoupons, newCoupon } from '../controllers/payment.js';

const app = express.Router();


// getting discount
app.get("/discount",applyDiscount);

// admin routes 
// new User /api/v1/user/new
app.post("/coupon/new",adminOnly,newCoupon);

// getting all coupon only for admin
app.get("/getAll",adminOnly,getAllCoupons);

// delete particular coupon
app.delete("/coupon/:id",adminOnly,deleteCoupon);
export default app;