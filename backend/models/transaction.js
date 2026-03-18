// backend/models/transaction.js
export default class Transaction {
  constructor({ id, clienteId, profesionalId, servicioId, montoTotal, montoComision, montoProfesional, estado, fecha }) {
    this.id = id; // UUID o autoincremental
    this.clienteId = clienteId; // referencia al User con rol "cliente"
    this.profesionalId = profesionalId; // referencia al User con rol "profesional"
    this.servicioId = servicioId; // referencia a ServiceRequest
    this.montoTotal = montoTotal; // monto total pagado por el cliente
    this.montoComision = montoComision; // 10% para el admin
    this.montoProfesional = montoProfesional; // 90% para el profesional
    this.estado = estado; // "pendiente", "aprobada", "rechazada"
    this.fecha = fecha; // timestamp
  }
}