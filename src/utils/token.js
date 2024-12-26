import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const generateAccessToken = (user) => {
  try {
    return jwt.sign(user, config.accessTokenSecret, { expiresIn: "2h" });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generateRefreshToken = (user) => {
  try {
    return jwt.sign(user, config.refreshTokenSecret);
  } catch (error) {
    console.error(error);
    return null;
  }
};
