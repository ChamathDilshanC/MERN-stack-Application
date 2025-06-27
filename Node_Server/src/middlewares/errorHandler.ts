
import { NextFunction } from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { ApiError } from "../../errors/ApiError";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(error.errors).map((e: any) => e.message);
        res.status(400).json({ errors: messages });
    } else if (error instanceof mongoose.Error) {
        res.status(400).json({ message: error.message });
    }else if(error instanceof ApiError){
        res.status(404).json({ message: error.message });
    } else {
        res.status(500).send("Internal server error");
    }
};