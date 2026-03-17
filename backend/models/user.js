// backend/models/user.js
export default class User {
  constructor({ id, nombre, email, password, rol }) {
    this.id = id; // UUID o autoincremental
    this.nombre = nombre;
    this.email = email;
    this.password = password; // encriptada con bcrypt
    this.rol = rol; // "cliente", "profesional", "admin"
  }
}