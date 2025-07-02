import { NextFunction, Request, Response } from "express";
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";
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
            return next(new ApiError(401, "Invalid access token"));
          } else {
            return next(new ApiError(401, "Could not authenticate token"));
          }
        }

        if (!decoded || typeof decoded === "string") {
          throw new ApiError(401, "Invalid token payload");
        }

        // Attach user info (e.g. userId) to request object for downstream handlers
        //req.user = (decoded as JwtPayload).userId; // we don't need this for this app

        next();
      }
    );
  } catch (err) {
    next(err);
  }
};
