export type Order = {
  _id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: "pending" | "completed" | "cancelled";
};

export type OrderItem = {
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  subtotal: number;
};
