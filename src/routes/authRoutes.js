import express from "express";
import { register, login, googleLogin, githubLogin } from "../controllers/userController.js";

const router = express.Router();

// Route to register a new user
router.post("/register", register);

// Route to login a user
router.post("/login", login);

// Route to login with Google
router.post("/google-login", googleLogin);

// Route to login with GitHub
router.post("/github-login", githubLogin);

export default router;
