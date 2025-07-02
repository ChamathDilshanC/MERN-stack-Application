import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  getOrdersByCustomer,
  updateOrder,
  updateOrderStatus,
} from "../controller/order.Controller";

const orderRouter = Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrders);
orderRouter.get("/customer/:customerId", getOrdersByCustomer);
orderRouter.get("/:id", getOrderById);
orderRouter.put("/:id", updateOrder);
orderRouter.patch("/:id/status", updateOrderStatus);
orderRouter.delete("/:id", deleteOrder);

// Add this line temporarily for testing
orderRouter.get("/test", (req, res) => {
  res.json({ message: "Order routes working!" });
});

console.log("Order routes initialized");

export default orderRouter;
