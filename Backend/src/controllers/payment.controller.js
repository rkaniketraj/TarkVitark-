// Payment/Subscription controller for plans and upgrades
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Payment from "../models/payment.modal.js";

// List available plans (static for now)
const getPlans = asyncHandler(async (req, res) => {
  const plans = [
    { tier: 'Free', price: 0, features: ['Public debates', 'Basic translation', 'Text-only discussions', 'Community moderation'] },
    { tier: 'Private', price: 29, features: ['Private debate rooms', 'Advanced translation', 'Voice + Text support', 'Basic analytics', 'Priority support'] },
    { tier: 'Premium', price: 99, features: ['Enterprise features', 'Premium translation', 'Advanced analytics', 'Custom branding', 'API access', 'Dedicated support'] },
  ];
  return res.status(200).json(new ApiResponse(200, plans, "Plans fetched successfully"));
});

// Subscribe/Upgrade to a plan (mock, extend for real payment)
const subscribePlan = asyncHandler(async (req, res) => {
  const { plan, paymentMethod } = req.body;
  if (!plan || !paymentMethod) throw new ApiError(400, "Plan and payment method required");
  // Here you would integrate with payment gateway and update user subscription
  // For now, just return success
  return res.status(200).json(new ApiResponse(200, { plan }, "Subscribed successfully"));
});

export {
  getPlans,
  subscribePlan,
};
