import express from "express";
import {
  getWorkers,
  createWorker,
  getWorkerById,
  updateWorker,
  deleteWorker,
  getMyWorker,
} from "../controllers/workerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getWorkers);
router.get("/me", authMiddleware(["profesional", "admin"]), getMyWorker);
router.post("/", authMiddleware(["profesional", "admin"]), createWorker);
router.get("/:id", getWorkerById);
router.put("/:id", authMiddleware(["profesional", "admin"]), updateWorker);
router.delete("/:id", authMiddleware(["admin"]), deleteWorker);

export default router;