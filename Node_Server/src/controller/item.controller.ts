import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";
import { ItemModel } from "../models/Item";

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Request body:", req.body); // Add logging

    // Validate required fields
    const { name, price } = req.body;
    if (!name || name.trim() === "") {
      throw new ApiError(400, "Item name is required");
    }

    // Validate and convert price
    const priceNumber = Number(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      throw new ApiError(400, "Valid price is required");
    }

    // Create item with validated data
    const itemData = {
      name: name.trim(),
      price: priceNumber,
    };

    console.log("Validated item data:", itemData);

    const item = new ItemModel(itemData);
    await item.save();
    console.log("Item saved:", item);
    res.status(201).json(item);
  } catch (error: any) {
    console.error("Error creating item:", error);
    next(error);
  }
};

// get all items
export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await ItemModel.find();
    res.status(200).json(items);
  } catch (error: any) {
    next(error);
  }
};

export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Use req.params.id instead of req.params._id
    const item = await ItemModel.findById(req.params.id);
    if (!item) {
      throw new ApiError(404, "Item not found");
    }
    res.status(200).json(item);
  } catch (error: any) {
    next(error);
  }
};

export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Use req.params.id instead of req.params._id
    const deletedItem = await ItemModel.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      throw new ApiError(404, "Item not found");
    }
    res.status(200).json({ message: "Item deleted" });
  } catch (error: any) {
    next(error);
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body for updates
    const { name, price } = req.body;
    const updateData: any = {};

    if (name !== undefined) {
      if (!name || name.trim() === "") {
        throw new ApiError(400, "Item name is required");
      }
      updateData.name = name.trim();
    }

    if (price !== undefined) {
      const priceNumber = Number(price);
      if (isNaN(priceNumber) || priceNumber <= 0) {
        throw new ApiError(400, "Valid price is required");
      }
      updateData.price = priceNumber;
    }

    // Use req.params.id instead of req.params._id
    const updatedItem = await ItemModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, // if true -> return the updated item
        runValidators: true, // run the validators before updating
      }
    );

    if (!updatedItem) {
      throw new ApiError(404, "Item not found");
    }

    res.status(200).json(updatedItem);
  } catch (error: any) {
    next(error);
  }
};
