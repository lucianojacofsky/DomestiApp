// backend/models/Worker.js
const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  especialidad: { type: String, required: true }, // plomero, electricista, etc.
  tarifa: { type: Number, required: true },       // precio por hora o servicio
  disponibilidad: { type: String, required: true }, // ej: "Lunes a Viernes 9-18"
  dni: { type: String, required: true, unique: true },
  verificado: { type: Boolean, default: false },  // validación de DNI
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Worker", workerSchema);