import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../server.js";
import User from "../models/user.js";

const SECRET = process.env.JWT_SECRET || "claveSuperSecreta";

export const register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  await db.read();
  const existe = db.data.users.find(u => u.email === email);
  if (existe) return res.status(400).json({ error: "Email ya registrado" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    id: Date.now().toString(),
    nombre,
    email,
    password: hashedPassword,
    rol
  });

  db.data.users.push(newUser);
  await db.write();

  res.status(201).json({ message: "Usuario registrado con éxito" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  await db.read();
  const user = db.data.users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Credenciales inválidas" });

  const token = jwt.sign(
    { id: user.id, rol: user.rol },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, rol: user.rol });
};