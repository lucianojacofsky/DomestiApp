import express from "express";
import { getMessagesByService, sendMessage, getUserConversations } from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Obtener mensajes de un servicio
router.get("/service/:serviceId", authMiddleware(), getMessagesByService);

// Enviar mensaje
router.post("/send", authMiddleware(), sendMessage);

// Obtener conversaciones del usuario
router.get("/conversations", authMiddleware(), getUserConversations);

export default router;