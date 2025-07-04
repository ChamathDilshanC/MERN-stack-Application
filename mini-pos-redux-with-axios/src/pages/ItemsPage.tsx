import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdAdd } from "react-icons/md";
import Dialog from "../components/Dialog";
import ItemForm from "../components/forms/ItemForm";
import ItemsTable from "../components/tables/ItemsTable";
import {
  addItem,
  deleteItem,
  getAllItems,
  updateItem,
} from "../services/itemService";
import type { Item } from "../types/Item";

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isItemsLoading, setIsItemsLoading] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchAllItems = async () => {
    try {
      setIsItemsLoading(true);
      const result = await getAllItems();
      setItems(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsItemsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  const removeItem = async (_id: string) => {
    await deleteItem(_id);
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsAddDialogOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteItem = (item: Item) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (itemData: Omit<Item, "_id">) => {
    // Fixed: use _id instead of id
    if (selectedItem) {
      // Update existing item
      try {
        const updatedItem = await updateItem(selectedItem._id, itemData);
        setItems((prev) =>
          prev.map((item) =>
            item._id === selectedItem._id ? updatedItem : item
          )
        );
        setIsEditDialogOpen(false);
        toast.success("Item updated successfully");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    } else {
      // Add new item
      try {
        const newItem = await addItem(itemData);
        setItems((prev) => [...prev, newItem]);
        setIsAddDialogOpen(false);
        toast.success("Item added successfully");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    }
    setSelectedItem(null);
  };

  const confirmDelete = async () => {
    if (selectedItem) {
      try {
        await removeItem(selectedItem._id);
        fetchAllItems(); // Refresh the list
        toast.success("Item deleted successfully");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedItem(null);
      }
    }
  };

  const cancelDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const getTotalValue = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isItemsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Items</h1>
            <p className="text-gray-600 mt-1">
              Total Items: {items.length} | Total Value:{" "}
              {formatPrice(getTotalValue())}
            </p>
          </div>
          <button
            onClick={handleAddItem}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150"
          >
            <MdAdd className="w-5 h-5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Items Table */}
        <ItemsTable
          items={items}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />

        {/* Add Item Dialog */}
        <Dialog
          isOpen={isAddDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement;
            if (form) {
              form.requestSubmit();
            }
          }}
          title="Add New Item"
        >
          <ItemForm onSubmit={handleFormSubmit} />
        </Dialog>

        {/* Edit Item Dialog */}
        <Dialog
          isOpen={isEditDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement;
            if (form) {
              form.requestSubmit();
            }
          }}
          title="Edit Item"
        >
          <ItemForm item={selectedItem} onSubmit={handleFormSubmit} />
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          isOpen={isDeleteDialogOpen}
          onCancel={cancelDialog}
          onConfirm={confirmDelete}
          title="Delete Item"
        >
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <strong>{selectedItem?.name}</strong>? This action cannot be undone.
          </p>
        </Dialog>
      </div>
    </div>
  );
};

export default ItemsPage;
