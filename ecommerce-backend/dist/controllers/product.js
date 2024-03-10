import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
// import {faker} from "@faker-js/faker";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    console.log(name, price, stock, category);
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
export const getAllCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    return res.status(200).json({
        success: true,
        categories,
    });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});
    return res.status(200).json({
        success: true,
        products
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    return res.status(200).json({
        success: true,
        product
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    console.log(name, price, stock, category);
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Product Not Found", 404));
    if (photo) {
        rm(product.photo, () => {
            console.log("Old Photo Deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    console.log(product.name);
    return res.status(200).json({
        success: true,
        product,
        message: "Product Updated Successfully",
    });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    if (product.photo) {
        rm(product.photo, () => {
            console.log("Product Photo Deleted");
        });
    }
    await product.deleteOne();
    return res.status(200).json({
        success: true,
        message: "Product deleted sucessfully"
    });
});
// filter functionality of products all
export const getAllProducts = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search) {
        baseQuery.name = {
            $regex: search,
            $options: "i",
        };
    }
    if (price) {
        baseQuery.price = {
            $lte: Number(price),
        };
    }
    if (category) {
        baseQuery.category = category;
    }
    const [products, filteredOnlyProduct] = await Promise.all([
        Product.find(baseQuery)
            .sort(sort ? { price: sort === "asc" ? 1 : -1 } : undefined)
            .limit(limit).skip(skip),
        Product.find(baseQuery)
    ]);
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
    return res.status(200).json({
        success: true,
        products,
        totalPage,
    });
});
// const deleteRandomProducts = async(count:number=10)=>{
//     const products = await Product.find({}).skip(2);
//     for(let i=0;i<products.length;i++){
//         const product = products[i];
//         await product.deleteOne();
//     }
//     console.log({success:true});
// }
// deleteRandomProducts(38);
// const generateRandomProducts = async(count:number=10)=>{
//     const products=[];
//     for(let i=0;i<count;i++){
//         const product = {
//             name:faker.commerce.productName(),
//             photo:"uploads\\5c08d563-2f39-480f-a0aa-3e62ff8f241e.jpg",
//             price:faker.commerce.price({min:1500,max:100000,dec:0}),
//             stock:faker.commerce.price({min:0,max:100,dec:0}),
//             category:faker.commerce.department(),
//             createdAt:new Date(faker.date.past()),
//             updatedAt:new Date(faker.date.recent()),
//             _v:0
//         };
//         products.push(product);
//     }
//     await Product.create(products);
//     console.log({success:true});
// }
// generateRandomProducts(40);
