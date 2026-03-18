import React, { useState, useEffect } from "react";
import API_CONFIG from "./config/api.js";
import Chat from "./Chat.js";

function ServicesList({ user }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(""); // filtro por estado
  const [selectedService, setSelectedService] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [chatServiceId, setChatServiceId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, [filter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      let url = `${API_CONFIG.BASE_URL}/services`;
      if (filter) {
        url += `?estado=${filter}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setServices(data);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptService = async (serviceId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_CONFIG.BASE_URL}/services/${serviceId}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            presupuestoOferido: selectedService?.presupuestoOferido,
            fechaCompromiso: selectedService?.fechaCompromiso,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo aceptar la solicitud");
      }

      fetchServices();
      setSelectedService(null);
      alert("Solicitud aceptada");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelService = async (serviceId) => {
    if (!window.confirm("¿Deseas cancelar esta solicitud?")) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_CONFIG.BASE_URL}/services/${serviceId}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo cancelar la solicitud");
      }

      fetchServices();
      alert("Solicitud cancelada");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteService = async (serviceId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const calificacion = prompt("Califica el servicio (1-5):");
      if (!calificacion) return;

      const comentario = prompt("Comentario (opcional):");

      const res = await fetch(
        `${API_CONFIG.BASE_URL}/services/${serviceId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            calificacion: parseInt(calificacion),
            comentario: comentario || "",
          }),
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo completar el servicio");
      }

      fetchServices();
      alert("Servicio completado");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayService = async (serviceId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_CONFIG.BASE_URL}/payments/pay-service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ servicioId: serviceId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "No se pudo iniciar el pago");
      }

      const data = await res.json();
      // Redirigir a MercadoPago
      window.location.href = data.init_point;
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeColor = (estado) => {
    const colors = {
      pendiente: "bg-yellow-100 text-yellow-800",
      aceptado: "bg-blue-100 text-blue-800",
      en_progreso: "bg-purple-100 text-purple-800",
      completado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-600">Cargando solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Solicitudes de Servicios
          </h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="aceptado">Aceptados</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completado">Completados</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 m-4 rounded-lg">
          {error}
        </div>
      )}

      {services.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-600">No hay solicitudes para mostrar</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {services.map((service) => (
            <div key={service.id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {service.tipoServicio}
                  </h3>
                  <p className="text-gray-600">{service.descripcion}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    📍 {service.ubicacion}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadgeColor(
                    service.estado
                  )}`}
                >
                  {service.estado.replace("_", " ")}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                {service.presupuestoOferido && (
                  <div>
                    <p className="text-gray-600">Presupuesto</p>
                    <p className="font-semibold">${service.presupuestoOferido}</p>
                  </div>
                )}
                {service.fechaCompromiso && (
                  <div>
                    <p className="text-gray-600">Fecha Compromiso</p>
                    <p className="font-semibold">
                      {new Date(service.fechaCompromiso).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {service.calificacion && (
                  <div>
                    <p className="text-gray-600">Calificación</p>
                    <p className="font-semibold">⭐ {service.calificacion}/5</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {user?.rol === "profesional" && service.estado === "pendiente" && (
                  <button
                    onClick={() => handleAcceptService(service.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition"
                  >
                    Aceptar Trabajo
                  </button>
                )}

                {user?.rol === "profesional" && service.profesionalId === user.id && ["aceptado", "en_progreso", "completado"].includes(service.estado) && (
                  <button
                    onClick={() => setChatServiceId(service.id)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                  >
                    💬 Chat
                  </button>
                )}

                {user?.rol === "cliente" && service.clienteId === user.id && (
                  <>
                    {["aceptado", "en_progreso"].includes(service.estado) && (
                      <button
                        onClick={() => handleCompleteService(service.id)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition"
                      >
                        Marcar Completado
                      </button>
                    )}
                    {service.estado === "completado" && (
                      <button
                        onClick={() => handlePayService(service.id)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition"
                      >
                        Pagar Servicio
                      </button>
                    )}
                    {["aceptado", "en_progreso", "completado"].includes(service.estado) && (
                      <button
                        onClick={() => setChatServiceId(service.id)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                      >
                        💬 Chat
                      </button>
                    )}
                    {service.estado === "pendiente" && (
                      <button
                        onClick={() => handleCancelService(service.id)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition"
                      >
                        Cancelar
                      </button>
                    )}
                  </>
                )}
              </div>

              {service.comentario && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Comentario:</strong> {service.comentario}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {chatServiceId && (
        <Chat
          serviceId={chatServiceId}
          user={user}
          onClose={() => setChatServiceId(null)}
        />
      )}
    </div>
  );
}

export default ServicesList;
