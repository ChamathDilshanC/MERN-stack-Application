import mongoose from "mongoose";

type Customer = {
    name: string
    email: string
    phone: string
    address: string

}

const CustomerSchema = new mongoose.Schema<Customer>({

    name: {
        type: String,
        minlength: [2, "Name must be at least 2 characters"],
        required: [true, "Name is required"],
        trim: true,
        
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        index:true,
        unique: [true, "user already registered"],
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "P9lease fill a valid email address"]
    },
    phone: {
        type: String,
        minlength: [10, "Phone number must be at least 10 digits"],
        required: [true, "Phone number is required"]
    },

    address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
        minlength: [5, "Address must be at least 5 characters"]
    }
})

export const CustomerModel = mongoose.model("Customer", CustomerSchema)