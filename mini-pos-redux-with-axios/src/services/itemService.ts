import type { Item } from "../types/Item";
import apiClient from "./apiClient";

export const getAllItems = async (): Promise<Item[]> => {
  const response = await apiClient.get("/items");
  return response.data;
};

export const deleteItem = async (_id: string): Promise<void> => {
  await apiClient.delete(`/items/${_id}`);
};

export const addItem = async (itemData: Omit<Item, "_id">): Promise<Item> => {
  const response = await apiClient.post("/items", itemData);
  return response.data;
};

export const updateItem = async (_id: string, itemData: Omit<Item, "_id">) => {
  const response = await apiClient.put(`/items/${_id}`, itemData);
  return response.data;
};
