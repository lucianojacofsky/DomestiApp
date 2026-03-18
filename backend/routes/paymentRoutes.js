import express from "express";
import { crearPago, obtenerTransacciones, pagarServicio } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", crearPago);
router.get("/transactions/:userId", obtenerTransacciones);
router.post("/pay-service", pagarServicio);

export default router;