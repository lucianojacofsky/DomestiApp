import express from "express";
import { crearPago, obtenerTransacciones, pagarServicio } from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware(["cliente", "admin"]), crearPago);
router.get("/transactions/:userId", authMiddleware(), obtenerTransacciones);
router.post("/pay-service", authMiddleware(["cliente", "admin"]), pagarServicio);

export default router;