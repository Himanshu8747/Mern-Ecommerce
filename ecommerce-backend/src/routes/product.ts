import express from 'express';
import { adminOnly } from '../middlewares/auth.js';
import { getlatestProducts, newProduct } from '../controllers/product.js';
import { singleUpload } from '../middlewares/multer.js';

const app = express.Router();

app.post("/new",singleUpload,newProduct);
app.get("/latest",getlatestProducts);
export default app;