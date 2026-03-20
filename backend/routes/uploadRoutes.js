import express from "express";
import fs from "fs/promises";
import path from "path";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/base64-image", authMiddleware(), async (req, res) => {
  try {
    const { dataUrl } = req.body;
    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
      return res.status(400).json({ error: "Formato de imagen inválido" });
    }

    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: "No se pudo procesar la imagen" });
    }

    const mimeType = match[1];
    const rawBase64 = match[2];
    const ext = mimeType.split("/")[1] || "png";
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const uploadDir = path.resolve("uploads");
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, Buffer.from(rawBase64, "base64"));

    return res.status(201).json({
      url: `/uploads/${fileName}`,
      fileName,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error al guardar imagen", details: error.message });
  }
});

export default router;
