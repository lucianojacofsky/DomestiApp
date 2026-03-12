const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB local
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Conectado a MongoDB local"))
  .catch(err => console.error("Error de conexión:", err));

// Importar modelo
const Worker = require("./models/Worker");

// Rutas
app.get("/", (req, res) => res.send("DomestiApp backend funcionando"));

// Crear nuevo trabajador
app.post("/workers", async (req, res) => {
  try {
    const worker = new Worker(req.body);
    await worker.save();
    res.status(201).json(worker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar todos los trabajadores
app.get("/workers", async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Puerto desde .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));