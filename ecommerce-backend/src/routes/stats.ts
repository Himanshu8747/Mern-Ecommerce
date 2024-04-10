// creating dashboard chart data 

import express from 'express';
import { adminOnly } from '../middlewares/auth.js';
import { getBarCharts, getDashboardStats, getLineCharts, getPieCharts } from '../controllers/stats.js';

const app = express.Router();

// new User /api/v1/dashboard/stats
app.post("/stats",adminOnly,getDashboardStats);
app.post("/pie",adminOnly,getPieCharts);
app.post("/bar",adminOnly,getBarCharts);
app.post("/line",adminOnly,getLineCharts);


export default app;