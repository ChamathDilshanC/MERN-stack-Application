import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ApiError } from "../errors/ApiError";

// Middleware to authenticate JWT access token
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Expect "Bearer TOKEN"

    if (!token) {
      return next(new ApiError(401, "Access token missing"));
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, decoded) => {
        if (err) {
          if (err instanceof TokenExpiredError) {
            return next(new ApiError(401, "Access token expired"));
          } else if (err instanceof JsonWebTokenError) {
            throw new ApiError(401, "Invalid access token");
          } else {
            throw new ApiError(401, "Access token verification failed");
          }
        }

        if (!decoded || typeof decoded === "string") {
          throw new ApiError(401, "Invalid token payload");
        }

        next();
      }
    );
  } catch (err) {
    next(err);
  }
};
