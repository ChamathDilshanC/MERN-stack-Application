import React, { useState } from "react"
import { MdAdd } from "react-icons/md"
import Dialog from "../components/Dialog"
import type { Item } from "../types/Item"
import ItemsTable from "../components/tables/ItemsTable"
import ItemForm from "../components/forms/ItemForm"
import { itemsData } from "../data/data"

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>(itemsData)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const handleAddItem = () => {
    setSelectedItem(null)
    setIsAddDialogOpen(true)
  }

  const handleEditItem = (item: Item) => {
    setSelectedItem(item)
    setIsEditDialogOpen(true)
  }

  const handleDeleteItem = (item: Item) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSubmit = (itemData: Omit<Item, "id">) => {
    if (selectedItem) {
      // Update existing item
      setItems((prev) =>
        prev.map((item) => (item.id === selectedItem.id ? { ...itemData, id: selectedItem.id } : item))
      )
      setIsEditDialogOpen(false)
      console.log("Item updated:", { ...itemData, id: selectedItem.id })
    } else {
      // Add new item
      const newItem = { ...itemData, id: Date.now() }
      setItems((prev) => [...prev, newItem])
      setIsAddDialogOpen(false)
      console.log("Item added:", newItem)
    }
    setSelectedItem(null)
  }

  const confirmDelete = () => {
    if (selectedItem) {
      setItems((prev) => prev.filter((item) => item.id !== selectedItem.id))
      console.log("Item deleted:", selectedItem)
      setIsDeleteDialogOpen(false)
      setSelectedItem(null)
    }
  }

  const cancelDialog = () => {
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    setIsDeleteDialogOpen(false)
    setSelectedItem(null)
  }

  const getTotalValue = () => {
    return items.reduce((total, item) => total + item.price, 0)
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
            <h1 className='text-3xl font-bold text-gray-800'>Items</h1>
            <p className='text-gray-600 mt-1'>
              Total Items: {items.length} | Total Value: {formatPrice(getTotalValue())}
            </p>
          </div>
          <button
            onClick={handleAddItem}
            className='flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150'
          >
            <MdAdd className='w-5 h-5' />
            <span>Add Item</span>
          </button>
        </div>

        {/* Items Table */}
        <ItemsTable items={items} onEdit={handleEditItem} onDelete={handleDeleteItem} />

        {/* Add Item Dialog */}
        <Dialog
          isOpen={isAddDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement
            if (form) {
              form.requestSubmit()
            }
          }}
          title='Add New Item'
        >
          <ItemForm onSubmit={handleFormSubmit} />
        </Dialog>

        {/* Edit Item Dialog */}
        <Dialog
          isOpen={isEditDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement
            if (form) {
              form.requestSubmit()
            }
          }}
          title='Edit Item'
        >
          <ItemForm item={selectedItem} onSubmit={handleFormSubmit} />
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog isOpen={isDeleteDialogOpen} onCancel={cancelDialog} onConfirm={confirmDelete} title='Delete Item'>
          <p className='text-gray-700'>
            Are you sure you want to delete <strong>{selectedItem?.name}</strong>? This action cannot be undone.
          </p>
        </Dialog>
      </div>
    </div>
  )
}

export default ItemsPage
