import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "claveSuperSecreta";

export const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Token requerido" });

    const token = header.split(" ")[1];
    try {
      const decoded = jwt.verify(token, SECRET);
      if (roles.length && !roles.includes(decoded.rol)) {
        return res.status(403).json({ error: "No autorizado" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Token inválido" });
    }
  };
};