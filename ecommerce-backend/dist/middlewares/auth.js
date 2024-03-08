// middleware to make sure only admin is allowed to perfrom some operations.
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query; // after ?
    if (!id)
        return next(new ErrorHandler("Admin Please Login First !!", 401));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 401));
    if (user.role !== "admin") {
        return next(new ErrorHandler("You are not authorized for Admin tasks !", 401));
    }
    next();
});
