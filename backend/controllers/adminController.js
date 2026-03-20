import { db } from "../server.js";

// Listar todos los usuarios
export const listarUsuarios = async (req, res) => {
  await db.read();
  const users = (db.data.users || []).map(({ password, ...safeUser }) => safeUser);
  res.json(users);
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

// Listar workers para gestión admin
export const listarWorkersAdmin = async (req, res) => {
  await db.read();
  res.json(db.data.workers || []);
};

// Listar solicitudes para gestión admin
export const listarSolicitudesAdmin = async (req, res) => {
  await db.read();
  res.json(db.data.serviceRequests || []);
};

// Cambiar estado de solicitud como admin
export const actualizarEstadoSolicitudAdmin = async (req, res) => {
  const { servicioId, estado } = req.body;
  await db.read();
  const servicio = db.data.serviceRequests.find((s) => s.id === servicioId);
  if (!servicio) return res.status(404).json({ error: "Servicio no encontrado" });

  const allowed = ["pendiente", "aceptado", "en_progreso", "completado", "cancelado"];
  if (!allowed.includes(estado)) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  servicio.estado = estado;
  await db.write();
  res.json({ message: "Estado actualizado", servicio });
};

// Listar payouts por profesional (comisión)
export const listarPayouts = async (req, res) => {
  await db.read();

  // Solo transacciones aprobadas
  const pagos = db.data.transactions.filter((t) => t.estado === "aprobada");

  const resumen = {};

  pagos.forEach((t) => {
    if (!resumen[t.profesionalId]) {
      const profesional = db.data.users.find((u) => u.id === t.profesionalId);
      resumen[t.profesionalId] = {
        profesionalId: t.profesionalId,
        nombre: profesional?.nombre || "-",
        email: profesional?.email || "-",
        totalCobrado: 0,
        totalComision: 0,
        totalNeto: 0,
        transacciones: 0,
      };
    }

    resumen[t.profesionalId].totalCobrado += t.montoTotal;
    const comision = t.montoComision || t.montoTotal * 0.1;
    resumen[t.profesionalId].totalComision += comision;
    resumen[t.profesionalId].totalNeto += t.montoTotal - comision;
    resumen[t.profesionalId].transacciones += 1;
  });

  res.json(Object.values(resumen));
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