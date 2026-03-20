import { db } from "../server.js";
import { Worker } from "../models/worker.js";
import { validateWorker } from "../validators/workerValidator.js";

// El rating se calcula sobre serviceRequests usando el ID del "profesional" (userId)
const calcularRating = (profesionalUserId) => {
  const ratings = db.data.serviceRequests
    .filter(
      (s) => s.profesionalId === profesionalUserId && typeof s.calificacion === "number"
    )
    .map((s) => s.calificacion);

  if (!ratings.length) return null;
  const total = ratings.reduce((sum, v) => sum + v, 0);
  return Math.round((total / ratings.length) * 10) / 10; // 1 decimal
};

export const getWorkers = async (req, res) => {
  try {
    await db.read();
    const workers = db.data.workers.map((w) => ({
      ...w,
      rating: calcularRating(w.userId),
    }));
    res.json(workers);
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

    // Asociar perfil al usuario autenticado (profesional)
    value.userId = req.user?.id || value.userId;

    const newWorker = new Worker(value);
    db.data.workers.push(newWorker.toJSON());
    await db.write();

    res.status(201).json({ ...newWorker.toJSON(), rating: calcularRating(newWorker.userId) });
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

    res.json({ ...worker, rating: calcularRating(worker.userId) });
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

    const existing = db.data.workers[index];

    // Solo el propio profesional o admin puede editar
    if (req.user.rol !== "admin" && existing.userId !== req.user.id) {
      return res.status(403).json({ error: "No autorizado" });
    }

    db.data.workers[index] = {
      ...existing,
      ...value,
      id: req.params.id,
      creadoEn: existing.creadoEn,
      userId: existing.userId,
    };
    await db.write();

    res.json({ ...db.data.workers[index], rating: calcularRating(db.data.workers[index].userId) });
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

export const getMyWorker = async (req, res) => {
  try {
    await db.read();
    const worker = db.data.workers.find((w) => w.userId === req.user.id);

    if (!worker) {
      return res.status(404).json({ error: "Perfil de profesional no encontrado" });
    }

    res.json({ ...worker, rating: calcularRating(worker.userId) });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener perfil", details: err.message });
  }
};