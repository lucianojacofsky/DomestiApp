// backend/server.js
import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// Importar rutas
import workerRoutes from "./routes/workerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// Más adelante: serviceRoutes, reviewRoutes, paymentRoutes, etc.

const app = express();
app.use(cors());
app.use(express.json());

// Base de datos con todas las entidades iniciales
const adapter = new JSONFile("db.json");
export const db = new Low(adapter, {
  users: [],
  workers: [],
  serviceCategories: [],
  professionalProfiles: []
});
await db.read();
db.data ||= {
  users: [],
  workers: [],
  serviceCategories: [],
  professionalProfiles: []
};
await db.write();

// Rutas
app.use("/workers", workerRoutes);
app.use("/users", userRoutes);
// Próximamente: app.use("/services", serviceRoutes);
// Próximamente: app.use("/reviews", reviewRoutes);
// Próximamente: app.use("/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});