// backend/models/message.js
export default class Message {
  constructor({ id, remitenteId, destinatarioId, servicioId, contenido, fecha, tipo = "texto", leido = false }) {
    this.id = id; // UUID o autoincremental
    this.remitenteId = remitenteId; // referencia al User (cliente o profesional)
    this.destinatarioId = destinatarioId; // referencia al User
    this.servicioId = servicioId; // referencia al ServiceRequest
    this.contenido = contenido; // texto del mensaje
    this.fecha = fecha; // timestamp
    this.tipo = tipo; // "texto", "imagen", "archivo", etc.
    this.leido = leido; // boolean: si el mensaje fue leído
  }
}