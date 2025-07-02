import mongoose from "mongoose";

type Item = {
  name: string;
  price: number;
};

const ItemSchema = new mongoose.Schema<Item>({
  name: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
    minlength: [2, "Item name must be at least 2 characters"],
  },
  price: {
    type: Number,
    required: [true, "Item price is required"],
    min: [0, "Item price must be positive"],
  },
});

export const ItemModel = mongoose.model("Item", ItemSchema);
