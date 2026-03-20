import { db } from "../server.js";
import Message from "../models/message.js";

const canUseServiceChat = (service, userId) => {
  if (!service) return false;
  const isAssigned = Boolean(service.profesionalId);
  if (!isAssigned) return false;
  const allowedStates = ["aceptado", "en_progreso", "completado"];
  if (!allowedStates.includes(service.estado)) return false;
  return service.clienteId === userId || service.profesionalId === userId;
};

// Obtener mensajes de un servicio específico
export const getMessagesByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const userId = req.user.id;

    await db.read();
    const service = db.data.serviceRequests.find(s => s.id === serviceId);

    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    // Chat solo disponible cuando hay profesional asignado y estado habilitado
    if (!canUseServiceChat(service, userId)) {
      return res.status(403).json({ error: "Chat no disponible para este servicio" });
    }

    const messages = db.data.messages.filter(m => m.servicioId === serviceId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
};

// Enviar mensaje (también usado por Socket.io)
export const sendMessage = async (req, res) => {
  try {
    const { servicioId, contenido, tipo = "texto" } = req.body;
    const remitenteId = req.user.id;

    await db.read();
    const service = db.data.serviceRequests.find(s => s.id === servicioId);

    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    // Chat solo disponible cuando hay profesional asignado y estado habilitado
    if (!canUseServiceChat(service, remitenteId)) {
      return res.status(403).json({ error: "Chat no disponible para este servicio" });
    }

    // Determinar destinatario
    const destinatarioId = service.clienteId === remitenteId ? service.profesionalId : service.clienteId;

    const newMessage = new Message({
      id: Date.now().toString(),
      remitenteId,
      destinatarioId,
      servicioId,
      contenido,
      fecha: new Date().toISOString(),
      tipo
    });

    db.data.messages.push(newMessage);
    await db.write();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
};

// Obtener conversaciones del usuario
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.read();

    // Obtener servicios donde el usuario participa
    const userServices = db.data.serviceRequests.filter(s =>
      s.clienteId === userId || s.profesionalId === userId
    );

    const conversations = userServices.map(service => {
      const lastMessage = db.data.messages
        .filter(m => m.servicioId === service.id)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];

      return {
        serviceId: service.id,
        serviceType: service.tipoServicio,
        serviceStatus: service.estado,
        otherUserId: service.clienteId === userId ? service.profesionalId : service.clienteId,
        lastMessage: lastMessage || null,
        unreadCount: db.data.messages.filter(m =>
          m.servicioId === service.id &&
          m.destinatarioId === userId &&
          !m.leido
        ).length
      };
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener conversaciones" });
  }
};