import { Router } from "express";
import  customerRouter  from "./customer.routes";

const rootRouter = Router()

rootRouter.use("/customers", customerRouter);

export default rootRouter;
