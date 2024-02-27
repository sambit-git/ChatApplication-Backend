import { Router } from "express";

import {
  getUsers,
  login,
  registerUser,
} from "../controllers/auth.controllers.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", isAuthenticated, getUsers);
router.post("/register", registerUser);
router.post("/login", login);

export default router;
