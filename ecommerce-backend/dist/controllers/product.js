import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please add photo", 401));
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log("Photo Deleted");
        });
        return next(new ErrorHandler("Please enter all fields", 401));
    }
    await Product.create({
        name, price, stock, category: category.toLowerCase(), photo: photo.path,
    });
    return res.status(201).json({
        success: true, message: "Product created successfully"
    });
});
export const getlatestProducts = TryCatch(async (req, res, next) => {
    // 1 = ascending -1= descending
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    return res.status(200).json({
        success: true,
        products
    });
});
