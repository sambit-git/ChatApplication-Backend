import { Router } from "express";

import {
  getUsers,
  login,
  registerUser,
  getSelf,
} from "../controllers/auth.controllers.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", isAuthenticated, getUsers);
router.get("/self", isAuthenticated, getSelf);
router.post("/register", registerUser);
router.post("/login", login);

export default router;
