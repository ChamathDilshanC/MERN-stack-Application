import { Router } from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomerById,
  updateCustomer,
} from "../controller/customer.controller";
import { authenticateToken } from "../middlewares/authenticateToken";

const customerRouter = Router();
// customerRouter.use(authenticateToken);

customerRouter.post("/", createCustomer);
customerRouter.get("/", getCustomer);
customerRouter.get("/:_id", getCustomerById);
customerRouter.delete("/:_id", deleteCustomer);
customerRouter.put("/:_id", updateCustomer);

export default customerRouter;
