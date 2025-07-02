import { Router } from "express";
import authRouter from "./auth.routes";
import customerRouter from "./customer.routes";
import itemRouter from "./item.routes";
import orderRouter from "./order.routes";

const rootRouter = Router();

rootRouter.use("/customers", customerRouter);
rootRouter.use("/items", itemRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/orders", orderRouter);

console.log("Root router initialized");

export default rootRouter;
