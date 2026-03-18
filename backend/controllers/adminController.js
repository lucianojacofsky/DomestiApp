import { db } from "../server.js";

// Listar todos los usuarios
export const listarUsuarios = async (req, res) => {
  await db.read();
  res.json(db.data.users);
};

// Cambiar rol de un usuario
export const cambiarRol = async (req, res) => {
  const { userId, nuevoRol } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  user.rol = nuevoRol;
  await db.write();
  res.json({ message: "Rol actualizado", user });
};

// Listar transacciones
export const listarTransacciones = async (req, res) => {
  await db.read();
  res.json(db.data.transactions);
};

// Resolver disputa (ejemplo simple)
export const resolverDisputa = async (req, res) => {
  const { servicioId, estado } = req.body;
  await db.read();
  const servicio = db.data.serviceRequests.find(s => s.id === servicioId);
  if (!servicio) return res.status(404).json({ error: "Servicio no encontrado" });

  servicio.estado = estado;
  await db.write();
  res.json({ message: "Disputa resuelta", servicio });
};