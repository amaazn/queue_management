import Manager from "../models/Manager.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";

const COOKIE_NAME = "token";

const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const manager = await Manager.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!manager || !(await manager.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(manager._id);

  res.cookie(COOKIE_NAME, token, cookieOptions);

  res.status(200).json({
    success: true,
    manager: {
      id: manager._id,
      name: manager.name,
      email: manager.email,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    manager: {
      id: req.manager._id,
      name: req.manager.name,
      email: req.manager.email,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});
