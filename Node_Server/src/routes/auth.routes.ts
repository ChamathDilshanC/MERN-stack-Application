import { Router } from "express";
import {
  getAllUsers,
  login,
  logout,
  refreshToken,
  signUp,
} from "../controller/auth.controller";
import { authenticateToken } from "../middlewares/authenticateToken";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.get("/users", authenticateToken, getAllUsers);
authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", logout);

export default authRouter;
