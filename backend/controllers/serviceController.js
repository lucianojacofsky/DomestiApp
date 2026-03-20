import { db } from "../server.js";
import ServiceRequest from "../models/serviceRequest.js";
import {
  validateCreateServiceRequest,
  validateUpdateServiceRequest,
} from "../validators/serviceValidator.js";

// Crear nueva solicitud de servicio
export const createServiceRequest = async (req, res) => {
  try {
    const { error, value } = validateCreateServiceRequest(req.body);

    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ error: "Validación fallida", messages });
    }

    const newRequest = new ServiceRequest({
      ...value,
      clienteId: req.user.id, // El usuario autenticado es el cliente
    });

    await db.read();
    db.data.serviceRequests.push(newRequest.toJSON());
    await db.write();

    res.status(201).json(newRequest.toJSON());
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Error al crear solicitud",
        details: err.message,
      });
  }
};

// Obtener todas las solicitudes (con filtros)
export const getServiceRequests = async (req, res) => {
  try {
    await db.read();
    let requests = db.data.serviceRequests || [];

    // Filtrar por estado si se proporciona
    if (req.query.estado) {
      requests = requests.filter((r) => r.estado === req.query.estado);
    }

    // Filtrar por tipo de servicio si se proporciona
    if (req.query.tipoServicio) {
      requests = requests.filter(
        (r) =>
          r.tipoServicio
            .toLowerCase()
            .includes(req.query.tipoServicio.toLowerCase())
      );
    }

    // Si el usuario es cliente, mostrar solo sus solicitudes
    if (req.user?.rol === "cliente") {
      requests = requests.filter((r) => r.clienteId === req.user.id);
    }

    // Si el usuario es profesional, mostrar solicitudes pendientes o asignadas a él
    if (req.user?.rol === "profesional") {
      requests = requests.filter(
        (r) =>
          r.estado === "pendiente" ||
          r.profesionalId === req.user.id ||
          r.estado === "completado"
      );
    }

    const usersById = new Map((db.data.users || []).map((u) => [u.id, u]));
    const enriched = requests.map((r) => ({
      ...r,
      clienteNombre: usersById.get(r.clienteId)?.nombre || null,
      profesionalNombre: usersById.get(r.profesionalId)?.nombre || null,
    }));

    // Paginación opcional simple
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || "50", 10)));
    const start = (page - 1) * limit;
    const end = start + limit;

    res.json({
      items: enriched.slice(start, end),
      page,
      limit,
      total: enriched.length,
      totalPages: Math.ceil(enriched.length / limit) || 1,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener solicitudes", details: err.message });
  }
};

// Obtener solicitud por ID
export const getServiceRequestById = async (req, res) => {
  try {
    await db.read();
    const request = db.data.serviceRequests?.find((r) => r.id === req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    // Verificar permisos
    if (
      req.user.rol === "cliente" &&
      request.clienteId !== req.user.id
    ) {
      return res
        .status(403)
        .json({ error: "No autorizado para ver esta solicitud" });
    }

    if (
      req.user.rol === "profesional" &&
      request.profesionalId !== req.user.id &&
      request.estado !== "pendiente"
    ) {
      return res
        .status(403)
        .json({ error: "No autorizado para ver esta solicitud" });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener solicitud", details: err.message });
  }
};

// Aceptar solicitud (profesional acepta trabajo)
export const acceptServiceRequest = async (req, res) => {
  try {
    if (req.user.rol !== "profesional" && req.user.rol !== "admin") {
      return res.status(403).json({ error: "Solo profesionales o admin pueden aceptar solicitudes" });
    }

    const { presupuestoOferido, fechaCompromiso, profesionalId } = req.body;

    await db.read();
    const request = db.data.serviceRequests.find((r) => r.id === req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    if (request.estado !== "pendiente") {
      return res
        .status(400)
        .json({ error: "Esta solicitud ya no está disponible" });
    }

    // Actualizar solicitud
    request.profesionalId = req.user.rol === "admin" ? profesionalId : req.user.id;
    if (req.user.rol === "admin" && !request.profesionalId) {
      return res.status(400).json({ error: "Admin debe asignar un profesional explícitamente" });
    }
    request.estado = "aceptado";
    if (presupuestoOferido) request.presupuestoOferido = presupuestoOferido;
    if (fechaCompromiso) request.fechaCompromiso = fechaCompromiso;

    await db.write();

    res.json({ message: "Solicitud aceptada", request });
  } catch (err) {
    res.status(500).json({ error: "Error al aceptar solicitud", details: err.message });
  }
};

// Completar solicitud
export const completeServiceRequest = async (req, res) => {
  try {
    const { calificacion, comentario } = req.body;

    await db.read();
    const request = db.data.serviceRequests.find((r) => r.id === req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    // Verificar permisos
    if (request.clienteId !== req.user.id) {
      return res.status(403).json({ error: "No autorizado para completar esta solicitud" });
    }

    if (!["aceptado", "en_progreso"].includes(request.estado)) {
      return res.status(400).json({ error: "Solicitud no puede ser completada" });
    }

    request.estado = "completado";
    if (calificacion) request.calificacion = calificacion;
    if (comentario) request.comentario = comentario;

    await db.write();

    res.json({ message: "Servicio completado", request });
  } catch (err) {
    res.status(500).json({ error: "Error al completar servicio", details: err.message });
  }
};

// Cancelar solicitud
export const cancelServiceRequest = async (req, res) => {
  try {
    await db.read();
    const request = db.data.serviceRequests.find((r) => r.id === req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    // Solo el cliente puede cancelar
    if (request.clienteId !== req.user.id) {
      return res.status(403).json({ error: "No autorizado para cancelar esta solicitud" });
    }

    request.estado = "cancelado";
    await db.write();

    res.json({ message: "Solicitud cancelada", request });
  } catch (err) {
    res.status(500).json({ error: "Error al cancelar solicitud", details: err.message });
  }
};
