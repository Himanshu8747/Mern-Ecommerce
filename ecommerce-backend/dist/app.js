import express from 'express';
import userRoute from './routes/user.js';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
const app = express();
app.use(express.json());
const PORT = 4000;
connectDB();
app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
});
// Using routes
app.use("/api/v1/user", userRoute);
app.use(errorMiddleware);
app.listen(PORT, () => { console.log(`Express running on http://localhost:${PORT}`); });
