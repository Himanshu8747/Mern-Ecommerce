import express from 'express';
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getSingleProduct, getlatestProducts, newProduct, updateProduct } from '../controllers/product.js';
import { singleUpload } from '../middlewares/multer.js';
import { adminOnly } from '../middlewares/auth.js';
const app = express.Router();
// add new product
app.post("/new", adminOnly, singleUpload, newProduct);
// get all products with filter
app.get("/all", getAllProducts);
// get all latest products
app.get("/latest", getlatestProducts);
// get all categories
app.get("/categories", getAllCategories);
// get all admin products
app.get("/admin-products", adminOnly, getAdminProducts);
// updating and deleting
app
    .route("/:id")
    .get(getSingleProduct)
    .put(adminOnly, singleUpload, updateProduct)
    .delete(adminOnly, deleteProduct);
export default app;
