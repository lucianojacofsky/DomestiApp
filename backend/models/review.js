// backend/models/review.js
export default class Review {
  constructor({ id, clienteId, profesionalId, servicioId, rating, comentario, fecha }) {
    this.id = id;
    this.clienteId = clienteId; // referencia al User con rol "cliente"
    this.profesionalId = profesionalId; // referencia al User con rol "profesional"
    this.servicioId = servicioId; // referencia a ServiceRequest
    this.rating = rating; // número de 1 a 5
    this.comentario = comentario; // obligatorio
    this.fecha = fecha; // timestamp
  }
}