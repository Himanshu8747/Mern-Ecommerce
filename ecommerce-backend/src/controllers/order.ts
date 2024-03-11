import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";

export const newOrder=TryCatch(async(req:Request<{},{},NewOrderRequestBody>,res,next)=>{
    const {shippingInfo,orderItems,user,subtotal,tax,shippingCharges,discount,total} = req.body;
    if(!shippingInfo || !orderItems || !user ||!subtotal || !tax || !total){
        return next(new ErrorHandler("Please enter all fields",400));
    }

    await Order.create({shippingInfo,orderItems,user,subtotal,tax,shippingCharges,discount,total});
    await reduceStock(orderItems);

    await invalidateCache({product:true,order:true,admin:true});

    return res.status(201).json({
        success:true,
        message:"Order Placed Successfully"
    })
})

export const myOrders=TryCatch(async(req,res,next)=>{
    const {id:user} = req.query;
    const key = `my-orders-${user}` 
    let orders = [];
    if(myCache.has(key)){
        orders = JSON.parse(myCache.get(key) as string);
    }
    else{
        orders = await Order.find({ user });
        myCache.set(key,JSON.stringify(orders));

    }

    return res.status(201).json({
        success:true,
        orders,
    })
})

export const allOrders=TryCatch(async(req,res,next)=>{
    const key = 'all-orders'; 
    let orders = [];
    if(myCache.has(key)){
        orders = JSON.parse(myCache.get(key) as string);
    }
    else{
        orders = await Order.find().populate("user","name");
        myCache.set(key,JSON.stringify(orders));

    }

    return res.status(201).json({
        success:true,
        orders,
    })
})