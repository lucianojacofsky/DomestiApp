// backend/models/serviceCategory.js
export default class ServiceCategory {
  constructor({ id, nombre, descripcion }) {
    this.id = id;
    this.nombre = nombre; // Ej: "Plomería", "Electricidad"
    this.descripcion = descripcion;
  }
}