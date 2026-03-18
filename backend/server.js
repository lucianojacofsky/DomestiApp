// backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { Low, JSONFile } from "lowdb";
import { Server } from "socket.io";
import http from "http";

// Importar rutas
import workerRoutes from "./routes/workerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// Más adelante: serviceRoutes, reviewRoutes, paymentRoutes, etc.

const app = express();
app.use(cors());
app.use(express.json());

// Base de datos con todas las entidades iniciales
const adapter = new JSONFile("db.json");
export const db = new Low(adapter, {
  users: [],
  workers: [],
  serviceCategories: [],
  professionalProfiles: [],
  serviceRequests: [],
  reviews: [],
  messages: [],
  transactions: []
});
await db.read();
db.data ||= {
  users: [],
  workers: [],
  serviceCategories: [],
  professionalProfiles: [],
  serviceRequests: [],
  reviews: [],
  messages: []
};
await db.write();

// Rutas
app.use("/workers", workerRoutes);
app.use("/users", userRoutes);
app.use("/services", serviceRoutes);
app.use("/payments", paymentRoutes);
app.use("/chat", chatRoutes);

// Webhook de MercadoPago (sin autenticación)
app.post("/payments/webhook", async (req, res) => {
  const { type, data } = req.body;

  try {
    if (type === "payment") {
      const paymentId = data.id;

      // Obtener detalles del pago desde MercadoPago
      const mercadopago = (await import("mercadopago")).default;
      mercadopago.configure({
        access_token: process.env.MP_ACCESS_TOKEN
      });

      const payment = await mercadopago.payment.get(paymentId);
      const externalReference = payment.body.external_reference;
      const status = payment.body.status;

      await db.read();
      const transaction = db.data.transactions.find(t => t.id === externalReference);

      if (transaction) {
        if (status === "approved") {
          transaction.estado = "aprobada";
        } else if (status === "rejected" || status === "cancelled") {
          transaction.estado = "rechazada";
        }
        await db.write();
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
});
app.use("/admin", adminRoutes);


// Configuración de Socket.io para chat en tiempo real
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Mapa para rastrear usuarios conectados por servicio
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Unirse a una sala de chat de servicio
  socket.on("joinServiceChat", async (data) => {
    const { serviceId, userId } = data;

    try {
      // Verificar que el usuario participe en el servicio
      await db.read();
      const service = db.data.serviceRequests.find(s => s.id === serviceId);

      if (!service || (service.clienteId !== userId && service.profesionalId !== userId)) {
        socket.emit("error", { message: "No autorizado para unirse a este chat" });
        return;
      }

      // Unirse a la sala del servicio
      socket.join(`service_${serviceId}`);

      // Registrar usuario conectado
      if (!connectedUsers.has(serviceId)) {
        connectedUsers.set(serviceId, new Set());
      }
      connectedUsers.get(serviceId).add(userId);

      console.log(`Usuario ${userId} se unió al chat del servicio ${serviceId}`);

      // Notificar a otros usuarios en la sala
      socket.to(`service_${serviceId}`).emit("userJoined", { userId });

    } catch (error) {
      console.error("Error al unirse al chat:", error);
      socket.emit("error", { message: "Error al unirse al chat" });
    }
  });

  // Enviar mensaje en tiempo real
  socket.on("sendMessage", async (data) => {
    const { serviceId, userId, content, type = "texto" } = data;

    try {
      // Verificar permisos
      await db.read();
      const service = db.data.serviceRequests.find(s => s.id === serviceId);

      if (!service || (service.clienteId !== userId && service.profesionalId !== userId)) {
        socket.emit("error", { message: "No autorizado para enviar mensajes" });
        return;
      }

      // Determinar destinatario
      const recipientId = service.clienteId === userId ? service.profesionalId : service.clienteId;

      const newMessage = {
        id: Date.now().toString(),
        remitenteId: userId,
        destinatarioId: recipientId,
        servicioId: serviceId,
        contenido: content,
        fecha: new Date().toISOString(),
        tipo: type,
        leido: false
      };

      // Guardar en base de datos
      db.data.messages.push(newMessage);
      await db.write();

      // Emitir solo a la sala del servicio
      io.to(`service_${serviceId}`).emit("receiveMessage", newMessage);

    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      socket.emit("error", { message: "Error al enviar mensaje" });
    }
  });

  // Marcar mensajes como leídos
  socket.on("markAsRead", async (data) => {
    const { serviceId, userId } = data;

    try {
      await db.read();
      const messages = db.data.messages.filter(m =>
        m.servicioId === serviceId && m.destinatarioId === userId && !m.leido
      );

      messages.forEach(msg => msg.leido = true);
      await db.write();

      // Notificar al remitente que los mensajes fueron leídos
      socket.to(`service_${serviceId}`).emit("messagesRead", { serviceId, userId });

    } catch (error) {
      console.error("Error al marcar mensajes como leídos:", error);
    }
  });

  // Salir del chat
  socket.on("leaveServiceChat", (data) => {
    const { serviceId, userId } = data;

    socket.leave(`service_${serviceId}`);

    if (connectedUsers.has(serviceId)) {
      connectedUsers.get(serviceId).delete(userId);
      if (connectedUsers.get(serviceId).size === 0) {
        connectedUsers.delete(serviceId);
      }
    }

    console.log(`Usuario ${userId} salió del chat del servicio ${serviceId}`);
    socket.to(`service_${serviceId}`).emit("userLeft", { userId });
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
    // Limpiar conexiones del usuario (esto sería más complejo en producción)
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});