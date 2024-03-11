import mongoose from 'mongoose';
import { Product } from '../models/product.js';
import { myCache } from '../app.js';
export const connectDB = () => {
    mongoose.connect("mongodb://localhost:27017", {
        dbName: "Ecommerce24",
    }).then(c => console.log(`Db Connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
export const invalidateCache = async ({ product, order, admin }) => {
    if (product) {
        const productKeys = ["latest-products", "categories", "all-products", ""];
        // for getSingle Product usig ID;
        const products = await Product.find({}).select("_id");
        products.forEach(element => {
            productKeys.push(`product-${element._id}`);
        });
        myCache.del(productKeys);
    }
    if (order) {
    }
    if (admin) {
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product) {
            throw new Error("Product not found !");
        }
        product.stock -= order.quantity;
        await product.save();
    }
};
