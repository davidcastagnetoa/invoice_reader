import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    console.log("There is no token. Access denied!");
    return res.sendStatus(401);
  }

  jwt.verify(token, config.accessTokenSecret, (err, user) => {
    if (err) {
      console.log("Token is invalid");
      return res.sendStatus(403);
    }
    req.user = user;
    console.log("Token is valid");
    next();
  });
};
