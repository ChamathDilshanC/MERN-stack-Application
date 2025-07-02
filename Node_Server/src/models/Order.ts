import mongoose from "mongoose";

type OrderItem = {
  itemId: mongoose.Types.ObjectId;
  itemName: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  items: OrderItem[];
  total: number;
  date: Date;
  status: "pending" | "completed" | "cancelled";
};

const OrderItemSchema = new mongoose.Schema<OrderItem>({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: [true, "Item ID is required"],
  },
  itemName: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Item price is required"],
    min: [0, "Item price must be positive"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  subtotal: {
    type: Number,
    required: [true, "Subtotal is required"],
    min: [0, "Subtotal must be positive"],
  },
});

const OrderSchema = new mongoose.Schema<Order>(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer ID is required"],
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    items: {
      type: [OrderItemSchema],
      required: [true, "Order items are required"],
      validate: {
        validator: function (items: OrderItem[]) {
          return items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },
    total: {
      type: Number,
      required: [true, "Order total is required"],
      min: [0, "Order total must be positive"],
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, "Order date is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "completed", "cancelled"],
        message: "Status must be pending, completed, or cancelled",
      },
      default: "pending",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to calculate subtotal for each item
OrderSchema.pre("save", function (next) {
  if (this.items) {
    this.items.forEach((item) => {
      item.subtotal = item.price * item.quantity;
    });
  }
  next();
});

// Pre-save middleware to calculate total from items
OrderSchema.pre("save", function (next) {
  if (this.items && this.items.length > 0) {
    this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }
  next();
});

export const OrderModel = mongoose.model("Order", OrderSchema);
