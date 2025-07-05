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

// Apply authentication middleware if needed
customerRouter.use(authenticateToken);

customerRouter.post("/", createCustomer);
customerRouter.get("/", getCustomer);
customerRouter.get("/:_id", getCustomerById);
customerRouter.put("/:_id", updateCustomer);
customerRouter.delete("/:_id", deleteCustomer);

export default customerRouter;
