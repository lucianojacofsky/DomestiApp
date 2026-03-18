import { db } from "../server.js";
import { Worker } from "../models/worker.js";
import { validateWorker } from "../validators/workerValidator.js";

export const getWorkers = async (req, res) => {
  try {
    await db.read();
    res.json(db.data.workers);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener trabajadores", details: err.message });
  }
};

export const createWorker = async (req, res) => {
  try {
    const { error, value } = validateWorker(req.body);

    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ error: "Validación fallida", messages });
    }

    const newWorker = new Worker(value);
    db.data.workers.push(newWorker.toJSON());
    await db.write();

    res.status(201).json(newWorker.toJSON());
  } catch (err) {
    res.status(500).json({ error: "Error al crear trabajador", details: err.message });
  }
};

export const getWorkerById = async (req, res) => {
  try {
    await db.read();
    const worker = db.data.workers.find((w) => w.id === req.params.id);
    
    if (!worker) {
      return res.status(404).json({ error: "Trabajador no encontrado" });
    }
    
    res.json(worker);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener trabajador", details: err.message });
  }
};

export const updateWorker = async (req, res) => {
  try {
    const { error, value } = validateWorker(req.body);

    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ error: "Validación fallida", messages });
    }

    await db.read();
    const index = db.data.workers.findIndex((w) => w.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Trabajador no encontrado" });
    }

    db.data.workers[index] = { ...value, id: req.params.id, creadoEn: db.data.workers[index].creadoEn };
    await db.write();

    res.json(db.data.workers[index]);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar trabajador", details: err.message });
  }
};

export const deleteWorker = async (req, res) => {
  try {
    await db.read();
    const index = db.data.workers.findIndex((w) => w.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Trabajador no encontrado" });
    }

    const deletedWorker = db.data.workers.splice(index, 1);
    await db.write();

    res.json({ message: "Trabajador eliminado", worker: deletedWorker[0] });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar trabajador", details: err.message });
  }
};