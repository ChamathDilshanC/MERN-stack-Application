import { Request, Response } from "express";
import { ItemModel } from "../models/Item";

export const addItem = async (req: Request, res: Response) => {
  try {
    const { id, name, price } = req.body;
    if (!name || !price) {
      res.status(400).json({ message: "All fields are required" });
    }
    const newItem = new ItemModel({ id, name, price });
    await newItem.save();
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await ItemModel.find();
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await ItemModel.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const item = await ItemModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const item = await ItemModel.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
