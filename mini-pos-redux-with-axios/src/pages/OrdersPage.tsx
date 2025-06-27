import React, { useState } from "react"
import { MdAdd } from "react-icons/md"
import OrderView from "../components/OrderView"
import Dialog from "../components/Dialog"
import type { Customer } from "../types/Customer"
import type { Item } from "../types/Item"
import type { Order } from "../types/Order"
import OrdersTable from "../components/tables/OrdersTable"
import OrderForm from "../components/forms/OrderForm"
import { customersData, itemsData, ordersData } from "../data/data"

const OrdersPage: React.FC = () => {
  // Sample data - in real app, this would come from API
  const [customers] = useState<Customer[]>(customersData)

  const [items] = useState<Item[]>(itemsData)

  const [orders, setOrders] = useState<Order[]>(ordersData)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const handleAddOrder = () => {
    setSelectedOrder(null)
    setIsAddDialogOpen(true)
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsEditDialogOpen(true)
  }

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSubmit = (orderData: Omit<Order, "id" | "date">) => {
    if (selectedOrder) {
      // Update existing order
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id ? { ...orderData, id: selectedOrder.id, date: selectedOrder.date } : order
        )
      )
      setIsEditDialogOpen(false)
      console.log("Order updated:", { ...orderData, id: selectedOrder.id })
    } else {
      // Add new order
      const newOrder: Order = {
        ...orderData,
        id: Date.now(),
        date: new Date().toISOString(),
      }
      setOrders((prev) => [...prev, newOrder])
      setIsAddDialogOpen(false)
      console.log("Order added:", newOrder)
    }
    setSelectedOrder(null)
  }

  const confirmDelete = () => {
    if (selectedOrder) {
      setOrders((prev) => prev.filter((order) => order.id !== selectedOrder.id))
      console.log("Order deleted:", selectedOrder)
      setIsDeleteDialogOpen(false)
      setSelectedOrder(null)
    }
  }

  const cancelDialog = () => {
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    setIsViewDialogOpen(false)
    setIsDeleteDialogOpen(false)
    setSelectedOrder(null)
  }

  const getTotalRevenue = () => {
    return orders.filter((order) => order.status === "completed").reduce((total, order) => total + order.total, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Orders</h1>
            <p className='text-gray-600 mt-1'>
              Total Orders: {orders.length} | Total Revenue: {formatPrice(getTotalRevenue())}
            </p>
          </div>
          <button
            onClick={handleAddOrder}
            className='flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150'
          >
            <MdAdd className='w-5 h-5' />
            <span>Create Order</span>
          </button>
        </div>

        {/* Orders Table */}
        <OrdersTable orders={orders} onView={handleViewOrder} onEdit={handleEditOrder} onDelete={handleDeleteOrder} />

        {/* Add Order Dialog */}
        <Dialog
          isOpen={isAddDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement
            if (form) {
              form.requestSubmit()
            }
          }}
          title='Create New Order'
        >
          <OrderForm customers={customers} items={items} onSubmit={handleFormSubmit} />
        </Dialog>

        {/* Edit Order Dialog */}
        <Dialog
          isOpen={isEditDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement
            if (form) {
              form.requestSubmit()
            }
          }}
          title='Edit Order'
        >
          <OrderForm order={selectedOrder} customers={customers} items={items} onSubmit={handleFormSubmit} />
        </Dialog>

        {/* View Order Dialog */}
        <Dialog isOpen={isViewDialogOpen} onCancel={cancelDialog} onConfirm={cancelDialog} title='Order Details'>
          {selectedOrder && <OrderView order={selectedOrder} />}
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog isOpen={isDeleteDialogOpen} onCancel={cancelDialog} onConfirm={confirmDelete} title='Delete Order'>
          <p className='text-gray-700'>
            Are you sure you want to delete Order #{selectedOrder?.id}? This action cannot be undone.
          </p>
        </Dialog>
      </div>
    </div>
  )
}

export default OrdersPage
