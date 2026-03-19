import express from "express";
import { listarUsuarios, cambiarRol, listarTransacciones, listarPayouts, resolverDisputa } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas las rutas protegidas solo para admin
router.get("/users", authMiddleware(["admin"]), listarUsuarios);
router.put("/users/role", authMiddleware(["admin"]), cambiarRol);
router.get("/transactions", authMiddleware(["admin"]), listarTransacciones);
router.get("/payouts", authMiddleware(["admin"]), listarPayouts);
router.put("/disputes", authMiddleware(["admin"]), resolverDisputa);

export default router;