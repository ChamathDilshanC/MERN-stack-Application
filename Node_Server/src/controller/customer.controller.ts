import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";
import { CustomerModel } from "../models/Customer";

export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cusId = req.body.id;

    const isCustomer = await CustomerModel.findOne({ _id: cusId });

    if (isCustomer == null) {
      if (req.body != null) {
        const customer = new CustomerModel(req.body);
        await customer.save();
        console.log("save customer!");
        res.status(201).json(customer);
      } else {
        res.status(400).send("User Data is not Found!");
      }
    } else {
      res.status(400).send("User id is Already exit!");
    }
  } catch (e: any) {
    next(e);
  }
};

export const getCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = await CustomerModel.find();
    res.status(200).json(customer);
  } catch (error: any) {
    next(error);
  }
};

export const getCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = await CustomerModel.findById(req.params._id);
    if (!customer) {
      throw new ApiError(404, "Customer not found");
    }
    res.status(200).json(customer);
  } catch (error: any) {
    next(error);
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = await CustomerModel.findOneAndDelete({
      id: req.params.id,
    });
    if (!customer) {
      throw new ApiError(404, "Customer not found");
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error: any) {
    next(error);
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) {
      throw new ApiError(404, "Customer not found");
    }
    res
      .status(200)
      .json({ message: "Customer updated successfully", updatedCustomer });
  } catch (error: any) {
    next(error);
  }
};
