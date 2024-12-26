import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    console.warn("There is no auth token. Access denied!");
    return res.sendStatus(401);
  }

  jwt.verify(token, config.accessTokenSecret, (err, user) => {
    if (err) {
      console.error("auth Token is invalid", err);
      return res.sendStatus(403);
    }
    req.user = user;
    console.log("auth Token is valid");
    next();
  });
};
