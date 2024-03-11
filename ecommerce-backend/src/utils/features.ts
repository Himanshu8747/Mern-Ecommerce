import mongoose from 'mongoose';
import { invalidateCacheProps } from '../types/types.js';
import { Product } from '../models/product.js';
import { myCache } from '../app.js';

export const connectDB=()=>{
    mongoose.connect("mongodb://localhost:27017",{
        dbName:"Ecommerce24",
    }).then(c=>console.log(`Db Connected to ${c.connection.host}`))
    .catch((e)=>console.log(e));
}

export const invalidateCache=async({product,order,admin}:invalidateCacheProps)=>{
    if(product){
        const productKeys:string[]=["latest-products","categories","all-products",""];
        
        // for getSingle Product usig ID;
        const products = await Product.find({}).select("_id");
        products.forEach(element => {
            productKeys.push(`product-${element._id}`);
        });

        myCache.del(productKeys);
    }
    if(order){

    }
    if(admin){

    }
}