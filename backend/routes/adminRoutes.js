import express from "express";
import {
  listarUsuarios,
  cambiarRol,
  listarTransacciones,
  listarPayouts,
  resolverDisputa,
  listarWorkersAdmin,
  listarSolicitudesAdmin,
  actualizarEstadoSolicitudAdmin,
} from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas las rutas protegidas solo para admin
router.get("/users", authMiddleware(["admin"]), listarUsuarios);
router.put("/users/role", authMiddleware(["admin"]), cambiarRol);
router.get("/transactions", authMiddleware(["admin"]), listarTransacciones);
router.get("/payouts", authMiddleware(["admin"]), listarPayouts);
router.get("/workers", authMiddleware(["admin"]), listarWorkersAdmin);
router.get("/services", authMiddleware(["admin"]), listarSolicitudesAdmin);
router.put("/services/status", authMiddleware(["admin"]), actualizarEstadoSolicitudAdmin);
router.put("/disputes", authMiddleware(["admin"]), resolverDisputa);

export default router;