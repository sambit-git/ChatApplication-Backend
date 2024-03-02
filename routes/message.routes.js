import { Router } from "express";

import {
  fetchMessages,
  sendMessage,
} from "../controllers/message.controllers.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:chatId", isAuthenticated, fetchMessages);
router.post("/", isAuthenticated, sendMessage);

export default router;
