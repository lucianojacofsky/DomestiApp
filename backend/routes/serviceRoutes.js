import express from "express";
import {
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
  acceptServiceRequest,
  completeServiceRequest,
  cancelServiceRequest,
} from "../controllers/serviceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET todas las solicitudes (filtradas por rol del usuario)
router.get("/", authMiddleware(), getServiceRequests);

// POST crear nueva solicitud
router.post("/", authMiddleware(), createServiceRequest);

// GET solicitud por ID
router.get("/:id", authMiddleware(), getServiceRequestById);

// POST aceptar solicitud (profesional)
router.post("/:id/accept", authMiddleware(), acceptServiceRequest);

// POST completar solicitud (cliente)
router.post("/:id/complete", authMiddleware(), completeServiceRequest);

// POST cancelar solicitud (cliente)
router.post("/:id/cancel", authMiddleware(), cancelServiceRequest);

export default router;
