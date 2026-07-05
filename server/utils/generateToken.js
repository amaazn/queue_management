import jwt from "jsonwebtoken";

const generateToken = (managerId) => {
  return jwt.sign({ id: managerId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export default generateToken;
