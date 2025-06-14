// Debt controller for debt platform
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
// import Debt from "../models/debt.model.js"; // Uncomment when model is created

// Example: Create a new debt
const createDebt = asyncHandler(async (req, res) => {
  // const { amount, lender, borrower, dueDate, description } = req.body;
  // if (!amount || !lender || !borrower) {
  //   throw new ApiError(400, "Required fields missing");
  // }
  // const debt = await Debt.create({ amount, lender, borrower, dueDate, description });
  // return res.status(201).json(new ApiResponse(201, debt, "Debt created successfully"));
  return res.status(501).json(new ApiResponse(501, null, "Not implemented"));
});

// Example: Get all debts for a user
const getUserDebts = asyncHandler(async (req, res) => {
  // const userId = req.user._id;
  // const debts = await Debt.find({ $or: [{ lender: userId }, { borrower: userId }] });
  // return res.status(200).json(new ApiResponse(200, debts, "User debts fetched successfully"));
  return res.status(501).json(new ApiResponse(501, null, "Not implemented"));
});

// Example: Mark a debt as paid
const markDebtAsPaid = asyncHandler(async (req, res) => {
  // const { debtId } = req.params;
  // const debt = await Debt.findByIdAndUpdate(debtId, { status: "paid" }, { new: true });
  // if (!debt) throw new ApiError(404, "Debt not found");
  // return res.status(200).json(new ApiResponse(200, debt, "Debt marked as paid"));
  return res.status(501).json(new ApiResponse(501, null, "Not implemented"));
});

export {
  createDebt,
  getUserDebts,
  markDebtAsPaid,
};
