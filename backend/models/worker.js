// backend/models/Worker.js
import { v4 as uuidv4 } from "uuid";

export class Worker {
  constructor(data) {
    this.id = data.id || uuidv4(); // ID único
    this.userId = data.userId || null; // referencia al User con rol "profesional"
    this.nombre = data.nombre;
    this.oficio = data.oficio;
    this.descripcion = data.descripcion || null;
    this.experiencia = data.experiencia || null;
    this.imagenes = data.imagenes || []; // fotos/portafolio (base64 o URL)
    this.aliasPago = data.aliasPago || null; // alias para pagos
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
      userId: this.userId,
      nombre: this.nombre,
      oficio: this.oficio,
      descripcion: this.descripcion,
      experiencia: this.experiencia,
      imagenes: this.imagenes,
      aliasPago: this.aliasPago,
      telefono: this.telefono,
      tarifa: this.tarifa,
      disponibilidad: this.disponibilidad,
      dni: this.dni,
      verificado: this.verificado,
      creadoEn: this.creadoEn,
    };
  }
}