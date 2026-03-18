import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../server.js";
import User from "../models/user.js";
import { validateRegister, validateLogin } from "../validators/userValidator.js";

const SECRET = process.env.JWT_SECRET || "claveSuperSecreta";

export const register = async (req, res) => {
  try {
    const { error, value } = validateRegister(req.body);

    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ error: "Validación fallida", messages });
    }

    await db.read();
    const existe = db.data.users.find((u) => u.email === value.email);
    if (existe) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);
    const newUser = new User({
      nombre: value.nombre,
      email: value.email,
      password: hashedPassword,
      rol: value.rol,
    });

    db.data.users.push(newUser);
    await db.write();

    const token = jwt.sign(
      { id: newUser.id, rol: newUser.rol },
      SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(201)
      .json({
        message: "Usuario registrado con éxito",
        token,
        user: newUser.toJSON(),
      });
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Error al registrar usuario",
        details: err.message,
      });
  }
};

export const login = async (req, res) => {
  try {
    const { error, value } = validateLogin(req.body);

    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ error: "Validación fallida", messages });
    }

    await db.read();
    const user = db.data.users.find((u) => u.email === value.email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const match = await bcrypt.compare(value.password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al iniciar sesión", details: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    await db.read();
    const user = db.data.users.find((u) => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ error: "Error al obtener perfil", details: err.message });
  }
};