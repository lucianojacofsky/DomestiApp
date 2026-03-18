// backend/models/Worker.js
import { v4 as uuidv4 } from "uuid";

export class Worker {
  constructor(data) {
    this.id = data.id || uuidv4(); // ID único
    this.nombre = data.nombre;
    this.oficio = data.oficio;
    this.telefono = data.telefono;
    this.tarifa = data.tarifa || null; // precio por hora
    this.disponibilidad = data.disponibilidad || "No especificada";
    this.dni = data.dni || null;
    this.verificado = data.verificado || false;
    this.creadoEn = data.creadoEn || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      oficio: this.oficio,
      telefono: this.telefono,
      tarifa: this.tarifa,
      disponibilidad: this.disponibilidad,
      dni: this.dni,
      verificado: this.verificado,
      creadoEn: this.creadoEn,
    };
  }
}