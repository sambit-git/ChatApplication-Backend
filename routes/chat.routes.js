import { Router } from "express";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

import {
  ontToOneChat,
  fetchAllChats,
  createGroup,
  addToGroup,
  renameGroup,
  removeFromGroup,
} from "../controllers/chat.controllers.js";

const router = Router();

router.post("/", isAuthenticated, ontToOneChat);
router.get("/", isAuthenticated, fetchAllChats);
router.post("/group-create", isAuthenticated, createGroup);
router.put("/group-add", isAuthenticated, addToGroup);
router.put("/group-remove", isAuthenticated, removeFromGroup);
router.put("/group-rename", isAuthenticated, renameGroup);

export default router;
