import jwt from "jsonwebtoken";
import Manager from "../models/Manager.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, "Not authorized, no token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Not authorized, token is invalid or expired");
  }

  const manager = await Manager.findById(decoded.id);
  if (!manager) {
    throw new ApiError(401, "Not authorized, manager no longer exists");
  }

  req.manager = manager;
  next();
});
