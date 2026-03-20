import React, { useEffect, useState } from "react";
import API_CONFIG from "./config/api.js";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [u, w, s, p] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/admin/users`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}/admin/workers`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}/admin/services`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}/admin/payouts`, { headers }),
      ]);

      if (!u.ok || !w.ok || !s.ok || !p.ok) {
        throw new Error("No se pudieron cargar datos administrativos");
      }

      setUsers(await u.json());
      setWorkers(await w.json());
      setServices(await s.json());
      setPayouts(await p.json());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const changeRole = async (userId, nuevoRol) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_CONFIG.BASE_URL}/admin/users/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, nuevoRol }),
    });
    fetchAll();
  };

  const changeServiceStatus = async (servicioId, estado) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_CONFIG.BASE_URL}/admin/services/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ servicioId, estado }),
    });
    fetchAll();
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
      )}

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Usuarios ({users.length})</h2>
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex justify-between items-center border-b pb-2">
              <span>{u.nombre} - {u.email}</span>
              <select
                value={u.rol}
                onChange={(e) => changeRole(u.id, e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="cliente">cliente</option>
                <option value="profesional">profesional</option>
                <option value="admin">admin</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Solicitudes ({services.length})</h2>
        <div className="space-y-2">
          {services.map((s) => (
            <div key={s.id} className="flex justify-between items-center border-b pb-2">
              <span>{s.tipoServicio} - {s.estado}</span>
              <select
                value={s.estado}
                onChange={(e) => changeServiceStatus(s.id, e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="pendiente">pendiente</option>
                <option value="aceptado">aceptado</option>
                <option value="en_progreso">en_progreso</option>
                <option value="completado">completado</option>
                <option value="cancelado">cancelado</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Profesionales ({workers.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {workers.map((w) => (
            <div key={w.id} className="border rounded p-3">
              <p className="font-semibold">{w.nombre}</p>
              <p className="text-sm text-gray-600">{w.oficio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Payouts / Comisiones ({payouts.length})</h2>
        <div className="space-y-2">
          {payouts.map((p) => (
            <div key={p.profesionalId} className="border rounded p-3">
              <p className="font-semibold">{p.nombre} ({p.email})</p>
              <p className="text-sm">Total cobrado: ${p.totalCobrado}</p>
              <p className="text-sm">Comisión: ${p.totalComision}</p>
              <p className="text-sm">Neto: ${p.totalNeto}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminPanel;
