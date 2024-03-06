import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";

export const newUser = async(req:Request,res:Response,next:NextFunction)=>{
    // creating new user
    try {
        // take incoming data from body
        const {} = req.body
        const user = await User.create({});
        res.status(200).json({
            success:true,
            message:`Welcome, ${user.name}`,
        })
    } catch (error) {
        
    }        
}