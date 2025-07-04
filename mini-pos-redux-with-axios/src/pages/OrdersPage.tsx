import React, { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import OrderView from "../components/OrderView";
import Dialog from "../components/Dialog";
import type { Customer } from "../types/Customer";
import type { Item } from "../types/Item";
import type { Order } from "../types/Order";
import OrdersTable from "../components/tables/OrdersTable";
import OrderForm from "../components/forms/OrderForm";
import { getAllCustomers } from "../services/customerService";
import { getAllItems } from "../services/itemService";
import {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/orderService";
import { ScaleLoader } from "react-spinners";

const OrdersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsOrdersLoading(true);
        console.log("Fetching data...");

        const [customersData, itemsData, ordersData] = await Promise.all([
          getAllCustomers(),
          getAllItems(),
          getAllOrders(),
        ]);

        console.log("Customers:", customersData);
        console.log("Items:", itemsData);
        console.log("Orders:", ordersData);

        setCustomers(customersData);
        setItems(itemsData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsOrdersLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setIsAddDialogOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (orderData: Omit<Order, "_id" | "date">) => {
    try {
      if (selectedOrder) {
        // Update existing order
        const backendOrderData = {
          customerId: orderData.customerId,
          customerName: orderData.customerName,
          items: orderData.items.map((item) => ({
            itemId: item.itemId,
            itemName: item.itemName,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
          total: orderData.total,
          status: orderData.status,
        };

        const updatedOrder = await updateOrder(
          selectedOrder._id,
          backendOrderData
        );

        setOrders((prev) =>
          prev.map((order) =>
            order._id === selectedOrder._id
              ? {
                  ...orderData,
                  _id: selectedOrder._id,
                  date: selectedOrder.date,
                }
              : order
          )
        );
        setIsEditDialogOpen(false);
        console.log("Order updated:", { ...orderData, _id: selectedOrder._id });
      } else {
        // Add new order
        const backendOrderData = {
          customerId: orderData.customerId,
          customerName: orderData.customerName,
          items: orderData.items,
          total: orderData.total,
          status: orderData.status,
        };

        const createdOrder = await createOrder(backendOrderData);

        const newOrder: Order = {
          ...orderData,
          _id: createdOrder._id, // Use the backend-generated ID
          date: new Date().toISOString(),
        };
        setOrders((prev) => [...prev, newOrder]);
        setIsAddDialogOpen(false);
        console.log("Order added:", newOrder);
      }
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const confirmDelete = async () => {
    if (selectedOrder) {
      try {
        await deleteOrder(selectedOrder._id);
        setOrders((prev) =>
          prev.filter((order) => order._id !== selectedOrder._id)
        );
        console.log("Order deleted:", selectedOrder);
        setIsDeleteDialogOpen(false);
        setSelectedOrder(null);
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const cancelDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsViewDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedOrder(null);
  };

  const getTotalRevenue = () => {
    return orders
      .filter((order) => order.status === "completed")
      .reduce((total, order) => total + order.total, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isOrdersLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="text-center">
            <ScaleLoader
              color="#4F46E5"
              loading={isOrdersLoading}
              height={35}
              width={4}
              radius={2}
              margin={2}
            />
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      );
  }



  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
            <p className="text-gray-600 mt-1">
              Total Orders: {orders.length} | Total Revenue:{" "}
              {formatPrice(getTotalRevenue())}
            </p>
          </div>
          <button
            onClick={handleAddOrder}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150"
          >
            <MdAdd className="w-5 h-5" />
            <span>Create Order</span>
          </button>
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-2 bg-yellow-100 rounded text-sm">
          <p>Customers loaded: {customers.length}</p>
          <p>Items loaded: {items.length}</p>
          <p>Orders loaded: {orders.length}</p>
        </div>

        {/* Orders Table */}
        <OrdersTable
          orders={orders}
          onView={handleViewOrder}
          onEdit={handleEditOrder}
          onDelete={handleDeleteOrder}
        />

        {/* Add Order Dialog */}
        <Dialog
          isOpen={isAddDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement;
            if (form) {
              form.requestSubmit();
            }
          }}
          title="Create New Order"
        >
          <OrderForm
            customers={customers}
            items={items}
            onSubmit={handleFormSubmit}
          />
        </Dialog>

        {/* Edit Order Dialog */}
        <Dialog
          isOpen={isEditDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement;
            if (form) {
              form.requestSubmit();
            }
          }}
          title="Edit Order"
        >
          <OrderForm
            order={selectedOrder}
            customers={customers}
            items={items}
            onSubmit={handleFormSubmit}
          />
        </Dialog>

        {/* View Order Dialog */}
        <Dialog
          isOpen={isViewDialogOpen}
          onCancel={cancelDialog}
          onConfirm={cancelDialog}
          title="Order Details"
        >
          {selectedOrder && <OrderView order={selectedOrder} />}
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          isOpen={isDeleteDialogOpen}
          onCancel={cancelDialog}
          onConfirm={confirmDelete}
          title="Delete Order"
        >
          <p className="text-gray-700">
            Are you sure you want to delete Order #{selectedOrder?._id}? This
            action cannot be undone.
          </p>
        </Dialog>
      </div>
    </div>
  );
};

export default OrdersPage;
