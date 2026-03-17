// backend/models/professionalProfile.js
export default class ProfessionalProfile {
  constructor({ id, userId, portafolio, certificaciones, zonas, tarifas }) {
    this.id = id;
    this.userId = userId; // referencia al User con rol "profesional"
    this.portafolio = portafolio; // links, descripciones
    this.certificaciones = certificaciones; // array de títulos/cursos
    this.zonas = zonas; // ej: ["CABA", "GBA Norte"]
    this.tarifas = tarifas; // objeto con precios por servicio
  }
}