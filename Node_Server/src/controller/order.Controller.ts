import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";
import { OrderModel } from "../models/Order";
import { CustomerModel } from "../models/Customer";
import { ItemModel } from "../models/Item";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId, customerName, items } = req.body;

    // Validate required fields
    if (!customerId || !customerName || !items || items.length === 0) {
      throw new ApiError(
        400,
        "Customer ID, customer name, and items are required"
      );
    }

    // Verify customer exists
    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      throw new ApiError(404, "Customer not found");
    }

    // Verify all items exist and prepare order items
    const validatedItems = [];

    for (const orderItem of items) {
      const item = await ItemModel.findById(orderItem.itemId);
      if (!item) {
        throw new ApiError(404, `Item with ID ${orderItem.itemId} not found`);
      }

      validatedItems.push({
        itemId: orderItem.itemId,
        itemName: item.name,
        price: item.price,
        quantity: orderItem.quantity,
        subtotal: 0, // Will be calculated by pre-save middleware
      });
    }

    // Create new order (total will be calculated by pre-save middleware)
    const newOrder = new OrderModel({
      customerId,
      customerName,
      items: validatedItems,
      total: 0, // Will be calculated by pre-save middleware
      status: req.body.status || "pending",
    });

    await newOrder.save();
    console.log("Order created successfully!");
    res.status(201).json(newOrder);
  } catch (error: any) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await OrderModel.find()
      .populate("customerId", "name email")
      .populate("items.itemId", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error: any) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate("customerId", "name email")
      .populate("items.itemId", "name price");

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    res.status(200).json(order);
  } catch (error: any) {
    next(error);
  }
};

export const getOrdersByCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId } = req.params;

    // Verify customer exists
    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      throw new ApiError(404, "Customer not found");
    }

    const orders = await OrderModel.find({ customerId })
      .populate("items.itemId", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error: any) {
    next(error);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { items, customerId, customerName } = req.body;

    // If items are being updated, validate them
    if (items && items.length > 0) {
      for (const orderItem of items) {
        const item = await ItemModel.findById(orderItem.itemId);
        if (!item) {
          throw new ApiError(404, `Item with ID ${orderItem.itemId} not found`);
        }
      }
    }

    // If customer is being updated, verify they exist
    if (customerId) {
      const customer = await CustomerModel.findById(customerId);
      if (!customer) {
        throw new ApiError(404, "Customer not found");
      }
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("customerId", "name email")
      .populate("items.itemId", "name price");

    if (!updatedOrder) {
      throw new ApiError(404, "Order not found");
    }

    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;

    if (!status || !["pending", "completed", "cancelled"].includes(status)) {
      throw new ApiError(
        400,
        "Valid status (pending, completed, cancelled) is required"
      );
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("customerId", "name email")
      .populate("items.itemId", "name price");

    if (!updatedOrder) {
      throw new ApiError(404, "Order not found");
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await OrderModel.findByIdAndDelete(req.params.id);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error: any) {
    next(error);
  }
};
