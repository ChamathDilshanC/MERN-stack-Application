import type { Order } from "../types/Order";
import apiClient from "./apiClient";

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get("/orders");
  return response.data;
};

export const getOrderById = async (_id: string): Promise<Order> => {
  const response = await apiClient.get(`/orders/${_id}`);
  return response.data;
};

export const getOrdersByCustomer = async (
  customerId: string
): Promise<Order[]> => {
  const response = await apiClient.get(`/orders/customer/${customerId}`);
  return response.data;
};

export const createOrder = async (
  orderData: Omit<Order, "_id" | "date" | "createdAt" | "updatedAt">
): Promise<Order> => {
  const response = await apiClient.post("/orders", orderData);
  return response.data;
};

export const updateOrder = async (
  _id: string,
  orderData: Omit<Order, "_id" | "date" | "createdAt" | "updatedAt">
): Promise<Order> => {
  const response = await apiClient.put(`/orders/${_id}`, orderData);
  return response.data;
};

export const updateOrderStatus = async (
  _id: string,
  status: "pending" | "completed" | "cancelled"
): Promise<Order> => {
  const response = await apiClient.patch(`/orders/${_id}/status`, { status });
  return response.data;
};

export const deleteOrder = async (_id: string): Promise<void> => {
  await apiClient.delete(`/orders/${_id}`);
};
