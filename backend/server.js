const express = require("express");
const cors = require("cors");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de base de datos local (archivo JSON)
const adapter = new JSONFile("db.json");
// 👇 Le pasamos un objeto vacío como default
const db = new Low(adapter, { workers: [] });

async function initDB() {
  await db.read();
  // Si no existe, inicializa con la estructura
  db.data ||= { workers: [] };
  await db.write();
}
initDB();

// Rutas
app.get("/", (req, res) => res.send("DomestiApp backend funcionando con base local"));

// Crear nuevo trabajador con validación
app.post("/workers", async (req, res) => {
  try {
    const { nombre, oficio, telefono } = req.body;

    if (!nombre || !oficio || !telefono) {
      return res.status(400).json({
        error: "Faltan campos obligatorios: nombre, oficio y teléfono",
      });
    }

    const worker = { nombre, oficio, telefono };
    db.data.workers.push(worker);
    await db.write();

    res.status(201).json(worker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar todos los trabajadores
app.get("/workers", async (req, res) => {
  try {
    res.json(db.data.workers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Puerto desde .env o por defecto 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));