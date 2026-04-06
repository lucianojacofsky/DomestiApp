import React, { useEffect, useState } from "react";
import API_CONFIG from "./config/api.js";
import { useTheme } from "./context/ThemeContext.js";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { isDark } = useTheme();

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [u, w, s, p, t] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/admin/users`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}/admin/workers`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}/admin/services`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}/admin/payouts`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}/admin/transactions`, { headers }),
      ]);

      if (!u.ok || !w.ok || !s.ok || !p.ok || !t.ok) {
        throw new Error("No se pudieron cargar datos administrativos");
      }

      setUsers(await u.json());
      setWorkers(await w.json());
      setServices(await s.json());
      setPayouts(await p.json());
      setTransactions(await t.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const changeRole = async (userId, nuevoRol) => {
    try {
      setActionLoading(userId);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/users/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, nuevoRol }),
      });

      if (!response.ok) throw new Error("No se pudo cambiar el rol");
      setSuccess("✅ Rol actualizado exitosamente");
      setTimeout(() => setSuccess(null), 3000);
      fetchAll();
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const changeServiceStatus = async (servicioId, estado) => {
    try {
      setActionLoading(`service-${servicioId}`);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/services/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ servicioId, estado }),
      });

      if (!response.ok) throw new Error("No se pudo cambiar el estado");
      setSuccess("✅ Estado actualizado exitosamente");
      setTimeout(() => setSuccess(null), 3000);
      fetchAll();
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const stats = {
    totalUsers: users.length,
    totalClients: users.filter(u => u.rol === "cliente").length,
    totalProfessionals: users.filter(u => u.rol === "profesional").length,
    totalServices: services.length,
    servicesCompleted: services.filter(s => s.estado === "completado").length,
    servicesPending: services.filter(s => s.estado === "pendiente").length,
    totalEarnings: payouts.reduce((acc, p) => acc + (p.totalComision || 0), 0),
    professionalsPending: payouts.filter(p => parseFloat(p.totalNeto || 0) > 0).length,
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Usuarios Totales" 
          value={stats.totalUsers} 
          icon="👥"
          isDark={isDark}
          color="from-blue-500 to-blue-600"
        />
        <StatCard 
          title="Clientes Activos" 
          value={stats.totalClients} 
          icon="👤"
          isDark={isDark}
          color="from-green-500 to-green-600"
        />
        <StatCard 
          title="Profesionales" 
          value={stats.totalProfessionals} 
          icon="🔧"
          isDark={isDark}
          color="from-purple-500 to-purple-600"
        />
        <StatCard 
          title="Servicios Activos" 
          value={stats.totalServices} 
          icon="📋"
          isDark={isDark}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Completados" 
          value={stats.servicesCompleted} 
          icon="✅"
          isDark={isDark}
          color="from-emerald-500 to-emerald-600"
          size="small"
        />
        <StatCard 
          title="Pendientes" 
          value={stats.servicesPending} 
          icon="⏳"
          isDark={isDark}
          color="from-yellow-500 to-yellow-600"
          size="small"
        />
        <StatCard 
          title="Comisiones" 
          value={`$${stats.totalEarnings.toFixed(0)}`} 
          icon="💰"
          isDark={isDark}
          color="from-indigo-500 to-indigo-600"
          size="small"
        />
        <StatCard 
          title="Pagos Pendientes" 
          value={stats.professionalsPending} 
          icon="💸"
          isDark={isDark}
          color="from-rose-500 to-rose-600"
          size="small"
        />
      </div>

      {/* Activity Summary */}
      <div className={`rounded-2xl p-8 shadow-lg border transition-all ${
        isDark
          ? "bg-gradient-to-br from-neutral-800 to-neutral-700 border-neutral-600"
          : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
      }`}>
        <h3 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
          📊 Resumen Rápido
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Tasa de Conversión</p>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {stats.totalServices > 0 ? ((stats.servicesCompleted / stats.totalServices) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Relación C/P</p>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {stats.totalProfessionals > 0 ? (stats.totalClients / stats.totalProfessionals).toFixed(1) : 0}:1
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <span className="text-2xl">💵</span>
            </div>
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Promedio por Servicio</p>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                ${stats.totalServices > 0 ? (stats.totalEarnings / stats.totalServices).toFixed(2) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className={`rounded-2xl overflow-hidden shadow-lg border transition-all ${
      isDark
        ? "bg-neutral-800 border-neutral-600"
        : "bg-white border-gray-200"
    }`}>
      <div className={`px-6 py-4 border-b ${isDark ? "bg-neutral-700 border-neutral-600" : "bg-gradient-to-r from-gray-50 to-white border-gray-200"}`}>
        <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          <span>👥</span> Gestión de Usuarios ({users.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDark ? "bg-neutral-700" : "bg-gray-50"}>
            <tr>
              <th className={`px-6 py-4 text-left text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Nombre</th>
              <th className={`px-6 py-4 text-left text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Email</th>
              <th className={`px-6 py-4 text-left text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Rol</th>
              <th className={`px-6 py-4 text-left text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{borderColor: isDark ? "#404040" : "#e5e7eb"}}>
            {users.map((u) => (
              <tr key={u.id} className={`hover:${isDark ? "bg-neutral-700" : "bg-gray-50"} transition-colors`}>
                <td className={`px-6 py-4 font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{u.nombre}</td>
                <td className={`px-6 py-4 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    u.rol === "admin" 
                      ? isDark 
                        ? "bg-red-900/40 text-red-200 border border-red-700" 
                        : "bg-red-100 text-red-800 border border-red-300"
                      : u.rol === "profesional"
                      ? isDark
                        ? "bg-blue-900/40 text-blue-200 border border-blue-700"
                        : "bg-blue-100 text-blue-800 border border-blue-300"
                      : isDark
                      ? "bg-green-900/40 text-green-200 border border-green-700"
                      : "bg-green-100 text-green-800 border border-green-300"
                  }`}>
                    {u.rol}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={u.rol}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    disabled={actionLoading === u.id}
                    className={`px-3 py-2 rounded-lg border-2 font-medium transition-all text-sm ${
                      isDark
                        ? "bg-neutral-700 border-neutral-600 text-white hover:border-primary-500 focus:border-primary-600"
                        : "bg-white border-gray-300 text-gray-900 hover:border-primary-500 focus:border-primary-600"
                    } ${actionLoading === u.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
                  >
                    <option value="cliente">cliente</option>
                    <option value="profesional">profesional</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <p className="text-sm">No hay usuarios aún</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderServices = () => (
    <div className={`rounded-2xl overflow-hidden shadow-lg border transition-all ${
      isDark
        ? "bg-neutral-800 border-neutral-600"
        : "bg-white border-gray-200"
    }`}>
      <div className={`px-6 py-4 border-b ${isDark ? "bg-neutral-700 border-neutral-600" : "bg-gradient-to-r from-gray-50 to-white border-gray-200"}`}>
        <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          <span>📋</span> Gestión de Solicitudes ({services.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDark ? "bg-neutral-700" : "bg-gray-50"}>
            <tr>
              <th className={`px-6 py-4 text-left text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Categoría</th>
              <th className={`px-6 py-4 text-left text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Estado</th>
              <th className={`px-6 py-4 text-left text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{borderColor: isDark ? "#404040" : "#e5e7eb"}}>
            {services.map((s) => (
              <tr key={s.id} className={`hover:${isDark ? "bg-neutral-700" : "bg-gray-50"} transition-colors`}>
                <td className={`px-6 py-4 font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{s.categoria}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    s.estado === "completado"
                      ? isDark
                        ? "bg-green-900/40 text-green-200 border border-green-700"
                        : "bg-green-100 text-green-800 border border-green-300"
                      : s.estado === "cancelado"
                      ? isDark
                        ? "bg-red-900/40 text-red-200 border border-red-700"
                        : "bg-red-100 text-red-800 border border-red-300"
                      : s.estado === "en_progreso"
                      ? isDark
                        ? "bg-blue-900/40 text-blue-200 border border-blue-700"
                        : "bg-blue-100 text-blue-800 border border-blue-300"
                      : isDark
                      ? "bg-yellow-900/40 text-yellow-200 border border-yellow-700"
                      : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                  }`}>
                    {s.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={s.estado}
                    onChange={(e) => changeServiceStatus(s.id, e.target.value)}
                    disabled={actionLoading === `service-${s.id}`}
                    className={`px-3 py-2 rounded-lg border-2 font-medium transition-all text-sm ${
                      isDark
                        ? "bg-neutral-700 border-neutral-600 text-white hover:border-primary-500 focus:border-primary-600"
                        : "bg-white border-gray-300 text-gray-900 hover:border-primary-500 focus:border-primary-600"
                    } ${actionLoading === `service-${s.id}` ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
                  >
                    <option value="pendiente">pendiente</option>
                    <option value="aceptado">aceptado</option>
                    <option value="en_progreso">en_progreso</option>
                    <option value="completado">completado</option>
                    <option value="cancelado">cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <p className="text-sm">No hay solicitudes aún</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPayouts = () => (
    <div className={`rounded-2xl overflow-hidden shadow-lg border transition-all ${
      isDark
        ? "bg-neutral-800 border-neutral-600"
        : "bg-white border-gray-200"
    }`}>
      <div className={`px-6 py-4 border-b ${isDark ? "bg-neutral-700 border-neutral-600" : "bg-gradient-to-r from-gray-50 to-white border-gray-200"}`}>
        <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          <span>💰</span> Pagos a Profesionales ({payouts.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDark ? "bg-neutral-700" : "bg-gray-50"}>
            <tr>
              <th className={`px-6 py-4 text-left text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Profesional</th>
              <th className={`px-6 py-4 text-left text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Email</th>
              <th className={`px-6 py-4 text-right text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Total</th>
              <th className={`px-6 py-4 text-right text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Comisión</th>
              <th className={`px-6 py-4 text-right text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Neto</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{borderColor: isDark ? "#404040" : "#e5e7eb"}}>
            {payouts.map((p) => (
              <tr key={p.profesionalId} className={`hover:${isDark ? "bg-neutral-700" : "bg-gray-50"} transition-colors`}>
                <td className={`px-6 py-4 font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{p.nombre}</td>
                <td className={`px-6 py-4 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{p.email}</td>
                <td className={`px-6 py-4 text-right font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  ${p.totalCobrado.toFixed(2)}
                </td>
                <td className={`px-6 py-4 text-right font-medium ${isDark ? "text-red-400" : "text-red-600"}`}>
                  -${p.totalComision.toFixed(2)}
                </td>
                <td className={`px-6 py-4 text-right font-bold text-lg ${isDark ? "text-green-400" : "text-green-600"}`}>
                  ${p.totalNeto.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payouts.length === 0 && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <p className="text-sm">No hay pagos aún</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-24 ${isDark ? "bg-neutral-800" : "bg-white"} rounded-2xl`}>
        <div className="relative w-16 h-16 mb-6">
          <div className={`absolute inset-0 rounded-full border-4 ${isDark ? "border-neutral-600" : "border-gray-200"}`}></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
        </div>
        <p className={`text-lg font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Cargando panel administrativo...</p>
        <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Por favor espera un momento</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alertas mejoradas */}
      {error && (
        <div className={`p-4 rounded-xl border-l-4 flex items-start gap-3 animate-slide-down ${
          isDark
            ? "bg-red-900/25 border-red-500 border-l-4"
            : "bg-red-50 border-red-500 border-l-4"
        }`}>
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div className="flex-1">
            <p className={`font-semibold ${isDark ? "text-red-200" : "text-red-700"}`}>Error</p>
            <p className={`text-sm mt-1 ${isDark ? "text-red-200/80" : "text-red-600"}`}>{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className={`text-xl flex-shrink-0 hover:opacity-70 transition-opacity`}
          >
            ✕
          </button>
        </div>
      )}
      {success && (
        <div className={`p-4 rounded-xl border-l-4 flex items-start gap-3 animate-slide-down ${
          isDark
            ? "bg-green-900/25 border-green-500"
            : "bg-green-50 border-green-500"
        }`}>
          <span className="text-2xl flex-shrink-0">✅</span>
          <div className="flex-1">
            <p className={`font-semibold ${isDark ? "text-green-200" : "text-green-700"}`}>Éxito</p>
            <p className={`text-sm mt-1 ${isDark ? "text-green-200/80" : "text-green-600"}`}>{success}</p>
          </div>
          <button 
            onClick={() => setSuccess(null)}
            className={`text-xl flex-shrink-0 hover:opacity-70 transition-opacity`}
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs Mejorados */}
      <div className={`rounded-2xl p-2 inline-flex gap-2 flex-wrap shadow-lg border transition-all ${
        isDark ? "bg-neutral-800 border-neutral-700" : "bg-white border-gray-200"
      }`}>
        {[
          { id: "dashboard", label: "📊 Panel", icon: "dashboard" },
          { id: "usuarios", label: "👥 Usuarios", icon: "usuarios" },
          { id: "solicitudes", label: "📋 Solicitudes", icon: "solicitudes" },
          { id: "pagos", label: "💰 Pagos", icon: "pagos" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? isDark
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/50"
                  : "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg"
                : isDark
                ? "text-gray-400 hover:text-gray-300 hover:bg-neutral-700"
                : "text-gray-600 hover:text-primary-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content con animación */}
      <div className="transition-all duration-300">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "usuarios" && renderUsers()}
        {activeTab === "solicitudes" && renderServices()}
        {activeTab === "pagos" && renderPayouts()}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, isDark, color, size = "regular" }) {
  const isSmall = size === "small";
  
  return (
    <div className={`rounded-2xl p-${isSmall ? "4" : "6"} shadow-lg border transition-all hover:shadow-xl hover:scale-105 transform ${
      isDark
        ? `bg-gradient-to-br ${color} border-opacity-20 border-white/10`
        : `bg-gradient-to-br ${color} border-opacity-20 border-white/30`
    }`}
    style={{
      backgroundImage: isDark 
        ? "linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(255,255,255,0.05) 100%)"
        : "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(0,0,0,0.05) 100%)"
    }}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-${isSmall ? "xs" : "sm"} font-semibold ${isDark ? "text-white/80" : "text-white/90"}`}>
            {title}
          </p>
          <p className={`${isSmall ? "text-2xl" : "text-3xl"} font-bold mt-2 text-white drop-shadow-lg`}>
            {value}
          </p>
        </div>
        <span className={`text-${isSmall ? "2xl" : "3xl"} drop-shadow-lg`}>{icon}</span>
      </div>
    </div>
  );
}

export default AdminPanel;
