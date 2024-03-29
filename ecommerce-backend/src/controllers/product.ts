import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody, SearchRequestQuery, baseQueryType } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
// import {faker} from "@faker-js/faker";

// revalidate cache on New, Update and delete product & new order. 
export const getlatestProducts = TryCatch(async(req:Request<{},{},NewProductRequestBody>,res,next)=>{

    let products = [];

    if(myCache.has("latest-products")) products = JSON.parse(myCache.get("latest-products") as string);

    else {
        products = await Product.find({}).sort({createdAt:-1}).limit(5);
        myCache.set("latest-products",JSON.stringify(products)); 
    }
    return res.status(200).json({
        success:true,
        products
    })
});

// revalidate cache on New, Update and delete product & new order.
export const getAllCategories = TryCatch(async(req:Request<{},{},NewProductRequestBody>,res,next)=>{
    let categories;

    if(myCache.has("categories"))
        categories = JSON.parse(myCache.get("categories") as string);
    else {
        categories = await Product.distinct("category");
        myCache.set("categories",JSON.stringify("categories"));
    }
    
    return res.status(200).json({
        success:true,
        categories,
    })
});

// revalidate cache on New, Update and delete product & new order.
export const getAdminProducts = TryCatch(async(req:Request<{},{},NewProductRequestBody>,res,next)=>{
    let products;
    if(myCache.has("all-products"))
        products = JSON.parse(myCache.get("all-products")as string);
    else{
        products = await Product.find({});
        myCache.set("all-products",JSON.stringify("all-products"));
    }
    products = await Product.find({});
    return res.status(200).json({
        success:true,
        products
    })
});


export const getSingleProduct = TryCatch(async(req,res,next)=>{
    let product;
    const id = req.params.id;

    if(myCache.has(`product-${id}`))
        product = JSON.parse(myCache.get(`product-${id}`)as string);
    else {
        product = await Product.findById(req.params.id);
        if(!product) return next(new ErrorHandler("Product not found",404));
        myCache.set(`product-${id}`,JSON.stringify(product));
    }
    
    return res.status(200).json({
        success:true,
        product
    })
});

export const newProduct = TryCatch(
    async(req:Request<{},{},NewProductRequestBody>,res,next)=>{
    const {name,price,stock,category} =req.body;
    console.log(name,price,stock,category);
    const photo = req.file;
    if(!photo) return next(new ErrorHandler("Please add photo",401));
    if(!name||!price||!stock||!category) {
        rm(photo.path,()=>{
            console.log("Photo Deleted");
        })
        return next(new ErrorHandler("Please enter all fields",401));
    }
    await Product.create({
        name,price,stock,category:category.toLowerCase(),photo:photo.path,
    })

    await invalidateCache({product:true});

    return res.status(201).json({
        success:true,message:"Product created successfully"
    })
});

export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    console.log(name,price,stock,category);
    const photo = req.file;
    const product = await Product.findById(id);
  
    if (!product) return next(new ErrorHandler("Product Not Found", 404));
  
    if (photo) {
      rm(product.photo!, () => {
        console.log("Old Photo Deleted");
      });
      product.photo = photo.path;
    }
  
    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
  
    await product.save();

    await invalidateCache({product:true});

    return res.status(200).json({
      success: true,
      product,
      message: "Product Updated Successfully",
    });
  });
  

export const deleteProduct = TryCatch(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product) return next(new ErrorHandler("Product not found",404));
    if(product.photo){
        rm(product.photo!,()=>{
            console.log("Product Photo Deleted");
        })
    }
    await product.deleteOne();

    await invalidateCache({product:true});
    
    return res.status(200).json({
        success:true,
        message:"Product deleted sucessfully"
    })
})


// filter functionality of products all

export const getAllProducts = TryCatch(async(req:Request<{},{},{},SearchRequestQuery>,res,next)=>{
    const {search,sort,category,price} = req.query;
    const page = Number(req.query.page) ||1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page-1)*limit;
    const baseQuery:baseQueryType = {};
    if(search){
        baseQuery.name = {
            $regex:search,
            $options:"i",
        }
    }
    if(price){
        baseQuery.price = {
            $lte:Number(price),
        }
    }
    if(category){
        baseQuery.category = category;
    }

    const [products,filteredOnlyProduct] = await Promise.all([
        Product.find(baseQuery)
        .sort(sort?{price:sort==="asc"?1:-1}:undefined)
        .limit(limit).skip(skip),
        Product.find(baseQuery)
    ])
    const totalPage = Math.ceil(filteredOnlyProduct.length/limit);

    return res.status(200).json({
        success:true,
        products,
        totalPage,
    })
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