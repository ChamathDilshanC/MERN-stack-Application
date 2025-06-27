import { createCustomer, getCustomer, getCustomerById, deleteCustomer ,updateCustomer } from "../controller/customer.controller";
import { Router } from "express";

const customerRouter = Router()

customerRouter.post("/", createCustomer);
customerRouter.get("/", getCustomer);
customerRouter.get("/:_id", getCustomerById)
customerRouter.delete("/:_id", deleteCustomer);
customerRouter.put("/:_id", updateCustomer);

export default customerRouter

