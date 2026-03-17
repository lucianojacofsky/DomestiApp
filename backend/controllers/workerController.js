import { db } from "../server.js";

export const getWorkers = async (req, res) => {
  await db.read();
  res.json(db.data.workers);
};

export const createWorker = async (req, res) => {
  const { nombre, oficio, telefono } = req.body;

  if (!nombre || !oficio || !telefono) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const worker = { nombre, oficio, telefono };
  db.data.workers.push(worker);
  await db.write();

  res.status(201).json(worker);
};