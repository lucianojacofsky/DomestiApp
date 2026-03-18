import express from "express";
import {
  getWorkers,
  createWorker,
  getWorkerById,
  updateWorker,
  deleteWorker,
} from "../controllers/workerController.js";

const router = express.Router();

router.get("/", getWorkers);
router.post("/", createWorker);
router.get("/:id", getWorkerById);
router.put("/:id", updateWorker);
router.delete("/:id", deleteWorker);

export default router;