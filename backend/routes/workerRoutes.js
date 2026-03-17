import express from "express";
import { getWorkers, createWorker } from "../controllers/workerController.js";

const router = express.Router();

router.get("/", getWorkers);
router.post("/", createWorker);

export default router;