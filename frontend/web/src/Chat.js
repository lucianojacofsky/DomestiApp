import React, { useState, useEffect, useRef, useCallback } from "react";
import API_CONFIG from "./config/api.js";

function Chat({ serviceId, user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_CONFIG.BASE_URL}/chat/service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al cargar mensajes");

      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  const setupSocketConnection = useCallback(() => {
    // Importar socket.io-client dinámicamente
    import("socket.io-client").then(({ io }) => {
      const socket = io(API_CONFIG.BASE_URL);

      socket.on("connect", () => {
        console.log("Conectado al chat");
        socket.emit("joinServiceChat", { serviceId, userId: user.id });
      });

      socket.on("receiveMessage", (message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on("messagesRead", (data) => {
        if (data.userId !== user.id) {
          setMessages(prev => prev.map(msg =>
            msg.servicioId === data.serviceId && msg.destinatarioId === user.id
              ? { ...msg, leido: true }
              : msg
          ));
        }
      });

      socket.on("error", (error) => {
        console.error("Error de socket:", error);
      });

      socketRef.current = socket;
    });
  }, [serviceId, user.id]);

  useEffect(() => {
    fetchMessages();
    setupSocketConnection();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [fetchMessages, setupSocketConnection]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem("token");

      // Enviar vía HTTP para persistencia
      const res = await fetch(`${API_CONFIG.BASE_URL}/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          servicioId: serviceId,
          contenido: newMessage.trim(),
          tipo: "texto"
        }),
      });

      if (!res.ok) throw new Error("Error al enviar mensaje");

      // El mensaje se agregará vía socket
      setNewMessage("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar mensaje");
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p className="text-gray-600">Cargando chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-3/4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Chat del Servicio</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No hay mensajes aún. ¡Inicia la conversación!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.remitenteId === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.remitenteId === user.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.contenido}</p>
                  <p className={`text-xs mt-1 ${
                    message.remitenteId === user.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.fecha)}
                    {message.leido && message.remitenteId === user.id && (
                      <span className="ml-1">✓✓</span>
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition"
            >
              {sending ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;