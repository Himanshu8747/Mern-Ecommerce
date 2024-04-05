import mongoose from 'mongoose';
import { OrderItemType, InvalidateCacheProps } from '../types/types.js';
import { Product } from '../models/product.js';
import { myCache } from '../app.js';
import { Order } from '../models/order.js';

export const connectDB=()=>{
    mongoose.connect("mongodb://localhost:27017",{
        dbName:"Ecommerce24",
    }).then(c=>console.log(`Db Connected to ${c.connection.host}`))
    .catch((e)=>console.log(e));
}

export const invalidateCache=async({product,order,admin,productId}:InvalidateCacheProps)=>{
    if(product){
        const productKeys:string[]=["latest-products","categories","all-products", `product-${productId}`];
        
        // for getSingle Product usig ID;
        const products = await Product.find({}).select("_id");
        products.forEach(element => {
            productKeys.push(`product-${element._id}`);
        });

        myCache.del(productKeys);
    }
    if(order){
        const orderKeys:string[] = ['all-orders'];
        const orders = await Order.find({}).select("_id");
        orders.forEach(i => {
            orderKeys.push(`order-${i._id}`);
        });

        myCache.del(orderKeys);
    }
    if(admin){

    }
}

export const reduceStock=async(orderItems:OrderItemType[]) =>{
    for (let i = 0; i< orderItems.length; i++) {
       const order = orderItems[i];
       const product = await Product.findById(order.productId);
       if(!product){
        throw new Error("Product not found !");
       } 
       product.stock-=order.quantity;
       await product.save();
    }

}