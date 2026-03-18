import express from "express";
import { getMessagesByService, sendMessage, getUserConversations } from "../controllers/chatController.js";

const router = express.Router();

// Obtener mensajes de un servicio
router.get("/service/:serviceId", getMessagesByService);

// Enviar mensaje
router.post("/send", sendMessage);

// Obtener conversaciones del usuario
router.get("/conversations", getUserConversations);

export default router;