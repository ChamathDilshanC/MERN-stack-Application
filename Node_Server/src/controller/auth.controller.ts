import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../errors/ApiError";
import UserModel from "../models/User";

const createAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    // ! ==> never null or undefined

    expiresIn: "15m",
  });
};

const createRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const SALT = 10;
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }
    const isUser = await UserModel.findOne({ email: email });
    if (!isUser) {
      const hashedPassword = await bcrypt.hash(password, SALT);
      const user = new UserModel({ name, email, password: hashedPassword });
      await user.save();
      const userWithoutPassword = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      res.status(201).json({
        message: "User created successfully",
        user: userWithoutPassword,
      });
    } else {
      res.status(400).json({ message: "User already exists" });
    }
  } catch (error: any) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserModel.find({}, "-password");
    res.status(200).json(users);
  } catch (error: any) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User Not Found");
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(
        401,
        "Invalid Credentials !!! Check Again And Try !!!"
      );
    }
    const accessToken = createAccessToken(user._id.toString());
    const refreshToken = createRefreshToken(user._id.toString());

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd, // true in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "api/auth/refresh-token",
    });

    const userWithoutPassword = {
      _id: user.id,
      name: user.name,
      email: user.email,
      accessToken,
    };
    res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new ApiError(401, "Refresh token missing");
      }
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        async (err: Error | null, decoded: JwtPayload | string | undefined) => {
          if (err) {
            if ((err as any).name === "TokenExpiredError") {
              throw new ApiError(401, "Refresh token expired");
            } else {
              throw new ApiError(401, "Invalid refresh token");
            }
          }
          if (!decoded || typeof decoded === "string") {
            throw new ApiError(401, "refresh token payload is invalid");
          }
          const userId = decoded.userId as string;
          const user = await UserModel.findById(userId);

          if (!user) {
            throw new ApiError(404, "User not found");
          }
          const accessToken = createAccessToken(user._id.toString());
          res.status(200).json({
            accessToken,
          });
        }
      );
    } catch (error) {
      next(error);
    }
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prod = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: prod,
    expires: new Date(0),
    path: "api/auth/refresh-token",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
