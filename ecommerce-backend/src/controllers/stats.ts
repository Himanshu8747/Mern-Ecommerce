import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage, getChartData, getInventories } from "../utils/features.js";

export const getDashboardStats = TryCatch(async(req,res,next)=>{
    let stats = {};
    
    if(myCache.has("admin-stats")) stats = JSON.parse(myCache.get("admin-stats") as string);

    else{
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() -6);

        const thisMonth = {
            start: new Date(today.getFullYear(),today.getMonth(),1),
            end:today
        }

        const lastMonth = {
            start: new Date(today.getFullYear(),today.getMonth() - 1,1),
            end: new Date(today.getFullYear(),today.getMonth(),0)
        }

        const thisMonthProductsPromise = Product.find({
            createdAt:{
                $gte:thisMonth.start,
                $lte:thisMonth.end
            }
        })

        const lastMonthProductsPromise = Product.find({
            createdAt:{
                $gte:lastMonth.start,
                $lte:lastMonth.end
            }
        })

        const thisMonthUsersPromise = User.find({
            createdAt:{
                $gte:thisMonth.start,
                $lte:thisMonth.end
            }
        })

        const lastMonthUsersPromise = User.find({
            createdAt:{
                $gte:lastMonth.start,
                $lte:lastMonth.end
            }
        })

        const thisMonthOrdersPromise = Order.find({
            createdAt:{
                $gte:thisMonth.start,
                $lte:thisMonth.end
            }
        })

        const lastMonthOrdersPromise = Order.find({
            createdAt:{
                $gte:lastMonth.start,
                $lte:lastMonth.end
            }
        })

        const lastSixMonthsOrdersPromise = Order.find({
            createdAt:{
                $gte:sixMonthsAgo,
                $lte:today,
            }
        })

        const lastestTransactionsPromise = Order.find({}).select(["orderItems","discount","total","status"]).limit(4);

        const [thisMonthProducts,thisMonthUsers, thisMonthOrders,lastMonthProducts,lastMonthUsers, lastMonthOrders, productsCount, usersCount, allOrders,lastSixMonthsOrders,categories,femaleUsersCount,latestTransactions] = await Promise.all([thisMonthProductsPromise,thisMonthUsersPromise,thisMonthOrdersPromise,lastMonthProductsPromise,lastMonthUsersPromise,lastMonthOrdersPromise,Product.countDocuments(),User.countDocuments(),Order.find({}).select("total"),lastSixMonthsOrdersPromise,Product.distinct("category"),User.countDocuments({gender:"female"}),lastestTransactionsPromise]);

        const thisMonthRevenue = thisMonthOrders.reduce(
            (total, order) => total + (order.total || 0),
            0
          );
      
          const lastMonthRevenue = lastMonthOrders.reduce(
            (total, order) => total + (order.total || 0),
            0
          );
      

        const changedPercent = {
            revenue:calculatePercentage(thisMonthRevenue,lastMonthRevenue),
            product:calculatePercentage(thisMonthProducts.length,lastMonthProducts.length),
            user:calculatePercentage(thisMonthUsers.length,lastMonthUsers.length),
            order:calculatePercentage(thisMonthOrders.length,lastMonthOrders.length)
        }

        const revenue = allOrders.reduce(
            (total, order) => total + (order.total || 0),
            0
          );

        const count = {
            revenue:revenue,
            product:productsCount,
            user:usersCount,
            order:allOrders.length,
        }  

        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthRevenue = new Array(6).fill(0);

        lastSixMonthsOrders.forEach((order)=>{
            const creationDate = order.createdAt;
            const monthDiff = (today.getMonth() - creationDate.getMonth() + 12)%12;

            if(monthDiff < 6){
                orderMonthCounts[6-monthDiff-1]+=1;
                orderMonthRevenue[6-monthDiff-1]+=order.total;
            }
        })

        // to give the number of items present for each category -> Inventory Part

        const categoryCount = await getInventories({categories,productsCount});

        // gender count

        const userRatio = {
            male:usersCount - femaleUsersCount,
            female:femaleUsersCount
        }

        const modifiedLatestTransaction = latestTransactions.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status,
          }));

        stats = {
            userRatio,
            modifiedLatestTransaction,
            categoryCount,
            changedPercent,
            count,
            chart:{
                order:orderMonthCounts,
                revenue:orderMonthRevenue
            }
        };

        myCache.set("admin-stats",JSON.stringify(stats));
        
    }

    return res.status(200).json({
        success:true,
        stats
    })
})
export const getPieCharts = TryCatch(async(req,res,next)=>{
    let charts;

    if(myCache.has("admin-pie-charts")) charts = JSON.parse(myCache.get("admin-pie-charts") as string);

    else {
        const allOrderPromise = Order.find({}).select(["total","discount","subtotal","tax","shippingCharges"]);
        const [processingOrder,shippedOrder,deliveredOrder,categories,productsCount,outOfStock,allOrders,allUsers,adminUsers,customerUsers] = await Promise.all([Order.countDocuments({status:"Processing"}),Order.countDocuments({status:"Shipped"}),Order.countDocuments({status:"Delivered"}),Product.distinct("category"),Product.countDocuments(),Product.countDocuments({stock:0}),allOrderPromise,User.find({}).select(["dob"]),User.countDocuments({role:"admin"}),User.countDocuments({role:"user"})]);

        const orderFullfillment = {
            processing:processingOrder,
            shipped:shippedOrder,
            delivered:deliveredOrder
        }

        const  productsCategories = await getInventories({categories,productsCount});

        const stockAvailability = {
            inStock:productsCount - outOfStock,
            outOfStock,
        }

        const grossIncome = allOrders.reduce((prev,order)=>prev+( order.total || 0),0);
        const discount = allOrders.reduce((prev,order)=>prev+( order.discount || 0),0);
        const productionCost = allOrders.reduce((prev,order)=>prev+( order.shippingCharges || 0),0);
        const burnt = allOrders.reduce((prev,order)=>prev+( order.tax || 0),0);
        const marketingCost = Math.round(grossIncome*(30/100));
        const netMargin = grossIncome - discount - productionCost - burnt - marketingCost;

        
        const revenueDistribution={
            netMargin,
            discount,
            productionCost,
            burnt,
            marketingCost
        };

        const usersAgeGroup = {
            teen:allUsers.filter(i=>i.age<20).length,
            adult:allUsers.filter(i=>i.age>=20 && i.age<40).length,
            old:allUsers.filter(i=>i.age>=40).length,
        }

        const adminCustomer = {
            admin:adminUsers,
            customer:customerUsers
        }

        charts = {
            orderFullfillment,
            productsCategories,
            stockAvailability,
            revenueDistribution,
            usersAgeGroup,
            adminCustomer
        };

        myCache.set("admin-pie-charts",JSON.stringify(charts));
    }
    

    return res.status(200).json({
        success:true,
        charts,
    })
})
export const getBarCharts = TryCatch(async(req,res,next)=>{
    let charts;
    const key = "admin-bar-charts";

    if(myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);

    else{

        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth()-6);
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth()-12);

        const sixMonthsProductPromise = Product.find({
            createdAt:{
                $gte:sixMonthsAgo,
                $lte:today,
            }
        })
        const sixMonthsUserPromise = User.find({
            createdAt:{
                $gte:sixMonthsAgo,
                $lte:today,
            }
        })

        const twelveMonthsOrdersPromise = Order.find({
            createdAt:{
                $gte:twelveMonthsAgo,
                $lte:today,
            }
        })


        const [products,users,orders] = await Promise.all([sixMonthsProductPromise,sixMonthsUserPromise,twelveMonthsOrdersPromise])

        const productCounts = getChartData({ length: 6, today, docArr: products });
        const usersCounts = getChartData({ length: 6, today, docArr: users });
        const ordersCounts = getChartData({ length: 12, today, docArr: orders });

    charts = {
      users: usersCounts,
      products: productCounts,
      orders: ordersCounts,
    };

        myCache.set(key,JSON.stringify(charts));

    }

    return res.status(200).json({
        success:true,
        charts,
    })
})
export const getLineCharts = TryCatch(async(req,res,next)=>{

})