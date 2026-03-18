// backend/models/user.js
import { v4 as uuidv4 } from "uuid";

export default class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.nombre = data.nombre;
    this.email = data.email;
    this.password = data.password; // encriptada con bcrypt
    this.rol = data.rol || "cliente"; // "cliente", "profesional", "admin"
    this.creadoEn = data.creadoEn || new Date().toISOString();
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
