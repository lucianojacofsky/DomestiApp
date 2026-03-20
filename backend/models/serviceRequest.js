// backend/models/serviceRequest.js
import { v4 as uuidv4 } from "uuid";

export default class ServiceRequest {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.clienteId = data.clienteId; // ID del usuario que solicita
    this.profesionalId = data.profesionalId || null; // ID del trabajador asignado
    this.tipoServicio = data.tipoServicio; // "plomería", "electricidad", etc.
    this.descripcion = data.descripcion;
    this.ubicacion = data.ubicacion;
    this.fotos = data.fotos || []; // array de URLs/base64
    this.presupuestoOferido = data.presupuestoOferido || null;
    this.estado = data.estado || "pendiente"; // pendiente | aceptado | en_progreso | completado | cancelado
    this.fechaSolicitud = data.fechaSolicitud || new Date().toISOString();
    this.fechaCompromiso = data.fechaCompromiso || null; // Cuando se espera completar
    this.calificacion = data.calificacion || null; // 1-5 estrellas
    this.comentario = data.comentario || null;
    this.pagoEstado = data.pagoEstado || "pendiente"; // pendiente | pagado | rechazado
    this.pagadoEn = data.pagadoEn || null;
  }

  toJSON() {
    return {
      id: this.id,
      clienteId: this.clienteId,
      profesionalId: this.profesionalId,
      tipoServicio: this.tipoServicio,
      descripcion: this.descripcion,
      ubicacion: this.ubicacion,
      fotos: this.fotos,
      presupuestoOferido: this.presupuestoOferido,
      estado: this.estado,
      fechaSolicitud: this.fechaSolicitud,
      fechaCompromiso: this.fechaCompromiso,
      calificacion: this.calificacion,
      comentario: this.comentario,
      pagoEstado: this.pagoEstado,
      pagadoEn: this.pagadoEn,
    };
  }
}