import React, { useState, useEffect } from "react";
import API_CONFIG from "./config/api.js";

function WorkersList({ onRefresh }) {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 10;

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
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar este trabajador?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
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

      // Refresca la lista
      fetchWorkers();
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-600 text-lg">Cargando trabajadores...</p>
      </div>
    );
  }

  if (workers.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-600 text-lg">No hay trabajadores registrados</p>
      </div>
    );
  }

  const filteredWorkers = workers.filter((w) =>
    `${w.nombre} ${w.oficio}`.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredWorkers.length / pageSize));
  const pageWorkers = filteredWorkers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Lista de Trabajadores ({filteredWorkers.length})
          </h2>
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Buscar por nombre u oficio"
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 m-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Oficio
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Tarifa
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {pageWorkers.map((worker) => (
              <tr
                key={worker.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-sm text-gray-900">{worker.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{worker.oficio}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{worker.telefono}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {worker.tarifa ? `$${worker.tarifa.toLocaleString()}` : "-"}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleDelete(worker.id)}
                    disabled={loading}
                    className="px-4 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-600">Página {page} de {totalPages}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkersList;