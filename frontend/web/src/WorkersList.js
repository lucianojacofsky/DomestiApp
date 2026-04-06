import React, { useState, useEffect } from "react";
import API_CONFIG from "./config/api.js";
import { Card, CardBody } from "./components/UI/Card";
import { Input } from "./components/UI/Input";
import { Button } from "./components/UI/Button";
import { Alert } from "./components/UI/Alert";
import { Badge } from "./components/UI/Badge";
import { useTheme } from "./context/ThemeContext.js";

function WorkersList({ onRefresh }) {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const pageSize = 9;
  const { isDark } = useTheme();

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await fetch(API_CONFIG.WORKERS_ENDPOINT, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar este trabajador?")) {
      return;
    }

    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_CONFIG.WORKERS_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error al eliminar: ${res.status}`);
      }

      fetchWorkers();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardBody className="text-center py-12">
          <div className="animate-pulse">
            <p className={`text-lg ${isDark ? "text-neutral-300" : "text-gray-600"}`}>
              Cargando trabajadores...
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (workers.length === 0) {
    return (
      <Card className="w-full highlighted">
        <CardBody className="text-center py-12">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">👷 No hay trabajadores registrados</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Comienza a agregar profesionales a tu red</p>
        </CardBody>
      </Card>
    );
  }

  const filteredWorkers = workers.filter((w) =>
    `${w.nombre} ${w.oficio}`.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredWorkers.length / pageSize));
  const pageWorkers = filteredWorkers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full space-y-4">
      {/* Encabezado y búsqueda */}
      <div className={`${isDark ? "bg-neutral-800" : "bg-white"} rounded-2xl p-6 shadow-soft`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              👷 Trabajadores
            </h2>
            <p className={`text-sm mt-1 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
              {filteredWorkers.length} profesional{filteredWorkers.length !== 1 ? "es" : ""} disponible{filteredWorkers.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Input
            placeholder="🔍 Buscar por nombre u oficio..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            dark={isDark}
            className="md:w-64"
          />
        </div>
      </div>

      {/* Errores */}
      {error && <Alert type="error">{error}</Alert>}

      {/* Grid de tarjetas */}
      {filteredWorkers.length === 0 ? (
        <Card className="w-full highlighted">
          <CardBody className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-300">Sin resultados</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Intenta con otra búsqueda</p>
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageWorkers.map((worker) => (
              <Card
                key={worker.id}
                className={`overflow-hidden transition-all hover:shadow-lg ${
                  isDark ? "" : "hover:border-primary-300"
                }`}
              >
                <CardBody className="space-y-4">
                  {/* Header de tarjeta */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        👤 {worker.nombre}
                      </h3>
                      <Badge variant="primary" icon="🔧">
                        {worker.oficio}
                      </Badge>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="space-y-2 py-4 border-t border-gray-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        📞 Teléfono
                      </span>
                      <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {worker.telefono}
                      </span>
                    </div>
                    {worker.tarifa && (
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                          💰 Tarifa
                        </span>
                        <span className="font-semibold text-secondary-600 dark:text-secondary-400">
                          ${worker.tarifa.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={deletingId === worker.id}
                    loading={deletingId === worker.id}
                    onClick={() => handleDelete(worker.id)}
                    className="w-full"
                  >
                    🗑️ Eliminar
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className={`${isDark ? "bg-neutral-800" : "bg-white"} rounded-2xl p-4 shadow-soft flex items-center justify-between`}>
              <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                Página <span className="font-bold">{page}</span> de <span className="font-bold">{totalPages}</span>
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
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                >
                  Siguiente →
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WorkersList;