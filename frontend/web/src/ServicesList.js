import React, { useState, useEffect, useCallback } from "react";
import API_CONFIG from "./config/api.js";
import Chat from "./Chat.js";
import { Card, CardHeader, CardBody } from "./components/UI/Card";
import { Input } from "./components/UI/Input";
import { Select } from "./components/UI/Input";
import { Button } from "./components/UI/Button";
import { Alert } from "./components/UI/Alert";
import { Badge } from "./components/UI/Badge";
import { useTheme } from "./context/ThemeContext.js";

function ServicesList({ user }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [chatServiceId, setChatServiceId] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1, total: 0 });
  const { isDark } = useTheme();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      let url = `${API_CONFIG.BASE_URL}/services`;
      const params = new URLSearchParams();
      if (filter) params.append("estado", filter);
      if (search.trim()) params.append("tipoServicio", search.trim());
      params.append("page", String(page));
      params.append("limit", "10");
      url += `?${params.toString()}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setServices(data.items || []);
      setMeta({
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      });
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, search, page]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAcceptService = async (service) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_CONFIG.BASE_URL}/services/${service.id}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            presupuestoOferido: service?.presupuestoOferido,
            fechaCompromiso: service?.fechaCompromiso,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo aceptar la solicitud");
      }

      fetchServices();
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
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert(data.message || "Pago iniciado en modo simulado");
        fetchServices();
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeVariant = (estado) => {
    const variants = {
      pendiente: "warning",
      aceptado: "primary",
      en_progreso: "secondary",
      completado: "success",
      cancelado: "danger",
    };
    return variants[estado] || "primary";
  };

  const getStatusIcon = (estado) => {
    const icons = {
      pendiente: "⏳",
      aceptado: "✅",
      en_progreso: "⚙️",
      completado: "🎉",
      cancelado: "❌",
    };
    return icons[estado] || "📋";
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardBody className="text-center py-12">
          <div className="animate-pulse">
            <p className={`text-lg ${isDark ? "text-neutral-300" : "text-gray-600"}`}>
              Cargando solicitudes...
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header y filtros */}
      <div className={`${isDark ? "bg-neutral-800" : "bg-white"} rounded-2xl p-6 shadow-soft`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              📋 Solicitudes de Servicios
            </h2>
            <p className={`text-sm mt-1 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
              {meta.total} solicitud{meta.total !== 1 ? "es" : ""} total{meta.total !== 1 ? "es" : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <Input
            placeholder="🔍 Buscar por tipo de servicio..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            dark={isDark}
            className="flex-1"
          />
          <Select
            options={[
              { value: "", label: "Todos los estados" },
              { value: "pendiente", label: "⏳ Pendientes" },
              { value: "aceptado", label: "✅ Aceptados" },
              { value: "en_progreso", label: "⚙️ En Progreso" },
              { value: "completado", label: "🎉 Completados" },
              { value: "cancelado", label: "❌ Cancelados" },
            ]}
            value={filter}
            onChange={(e) => {
              setPage(1);
              setFilter(e.target.value);
            }}
            dark={isDark}
            className="md:w-48"
          />
        </div>
      </div>

      {/* Errores */}
      {error && <Alert type="error">{error}</Alert>}

      {/* Listado de servicios */}
      {services.length === 0 ? (
        <Card className="w-full highlighted">
          <CardBody className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-300">📭 No hay solicitudes para mostrar</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <CardBody className="space-y-4">
                {/* Encabezado de la tarjeta */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        🔧 {service.tipoServicio}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(service.estado)} icon={getStatusIcon(service.estado)}>
                        {service.estado.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className={`${isDark ? "text-neutral-300" : "text-gray-600"} mb-2`}>
                      {service.descripcion}
                    </p>
                    <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                      📍 {service.ubicacion}
                    </p>
                  </div>
                </div>

                {/* Información de profesional/cliente */}
                <div className={`p-3 rounded-lg ${isDark ? "bg-neutral-700" : "bg-primary-50"}`}>
                  {user?.rol === "cliente" && service.profesionalNombre ? (
                    <p className={`text-sm ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                      <span className="font-semibold">👨‍🔧 Profesional:</span> {service.profesionalNombre}
                    </p>
                  ) : user?.rol === "profesional" && service.clienteNombre ? (
                    <p className={`text-sm ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                      <span className="font-semibold">👤 Cliente:</span> {service.clienteNombre}
                    </p>
                  ) : (
                    <p className={`text-sm ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                      <span className="font-semibold">⏳ Estado:</span> A la espera de profesional
                    </p>
                  )}
                </div>

                {/* Grid de información */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {service.presupuestoOferido && (
                    <div className={`p-3 rounded-lg ${isDark ? "bg-neutral-700" : "bg-gray-50"}`}>
                      <p className={`text-xs font-semibold ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        💰 Presupuesto
                      </p>
                      <p className={`font-bold text-secondary-600 dark:text-secondary-400 mt-1`}>
                        ${service.presupuestoOferido}
                      </p>
                    </div>
                  )}
                  {service.fechaCompromiso && (
                    <div className={`p-3 rounded-lg ${isDark ? "bg-neutral-700" : "bg-gray-50"}`}>
                      <p className={`text-xs font-semibold ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        📅 Fecha
                      </p>
                      <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"} mt-1`}>
                        {new Date(service.fechaCompromiso).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {service.calificacion && (
                    <div className={`p-3 rounded-lg ${isDark ? "bg-neutral-700" : "bg-gray-50"}`}>
                      <p className={`text-xs font-semibold ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        ⭐ Calificación
                      </p>
                      <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"} mt-1`}>
                        {service.calificacion}/5
                      </p>
                    </div>
                  )}
                  {service.pagoEstado && (
                    <div className={`p-3 rounded-lg ${isDark ? "bg-neutral-700" : "bg-gray-50"}`}>
                      <p className={`text-xs font-semibold ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        🏦 Pago
                      </p>
                      <Badge variant={service.pagoEstado === "pagado" ? "success" : "warning"} className="mt-1">
                        {service.pagoEstado}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Comentario */}
                {service.comentario && (
                  <div className={`p-3 rounded-lg border-l-4 ${isDark ? "bg-neutral-700 border-primary-500" : "bg-primary-50 border-primary-300"}`}>
                    <p className={`text-sm ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                      <span className="font-semibold">💬 Comentario:</span> {service.comentario}
                    </p>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-neutral-700">
                  {user?.rol === "profesional" && service.estado === "pendiente" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAcceptService(service)}
                      disabled={actionLoading}
                      loading={actionLoading}
                    >
                      ✅ Aceptar Trabajo
                    </Button>
                  )}

                  {user?.rol === "profesional" && service.profesionalId === user.id && ["aceptado", "en_progreso", "completado"].includes(service.estado) && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setChatServiceId(service.id)}
                    >
                      💬 Chat
                    </Button>
                  )}

                  {user?.rol === "cliente" && service.clienteId === user.id && (
                    <>
                      {["aceptado", "en_progreso"].includes(service.estado) && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleCompleteService(service.id)}
                          disabled={actionLoading}
                          loading={actionLoading}
                        >
                          ✓ Marcar Completado
                        </Button>
                      )}
                      {service.estado === "completado" && service.pagoEstado !== "pagado" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handlePayService(service.id)}
                          disabled={actionLoading}
                          loading={actionLoading}
                        >
                          💳 Pagar Servicio
                        </Button>
                      )}
                      {["aceptado", "en_progreso", "completado"].includes(service.estado) && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setChatServiceId(service.id)}
                        >
                          💬 Chat
                        </Button>
                      )}
                      {service.estado === "pendiente" && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelService(service.id)}
                          disabled={actionLoading}
                          loading={actionLoading}
                        >
                          ❌ Cancelar
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Paginación */}
      {meta.totalPages > 1 && (
        <div className={`${isDark ? "bg-neutral-800" : "bg-white"} rounded-2xl p-4 shadow-soft flex items-center justify-between`}>
          <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
            Página <span className="font-bold">{page}</span> de <span className="font-bold">{meta.totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
            >
              ← Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(meta.totalPages, prev + 1))}
              disabled={page >= meta.totalPages}
            >
              Siguiente →
            </Button>
          </div>
        </div>
      )}

      {/* Chat modal */}
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
