import express from 'express';
import { deleteProduct, getAdminProducts, getAllCategories, getSingleProduct, getlatestProducts, newProduct, updateSingleProduct } from '../controllers/product.js';
import { singleUpload } from '../middlewares/multer.js';
const app = express.Router();
// add new product
app.post("/new", singleUpload, newProduct);
// get all latest products
app.get("/latest", getlatestProducts);
// get all categories
app.get("/categories", getAllCategories);
// get all admin products
app.get("/admin-products", getAdminProducts);
// updating and deleting
app.route("/:id").get(getSingleProduct).put(updateSingleProduct).delete(deleteProduct);
export default app;
