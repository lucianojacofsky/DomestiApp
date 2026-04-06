import React, { useState } from "react";
import API_CONFIG from "./config/api.js";

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "cliente",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_CONFIG.USERS_ENDPOINT}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          rol: formData.rol,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.messages)) {
          throw new Error(data.messages.join(", "));
        }
        throw new Error(data.error || `Error ${res.status}`);
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess(true);
      setTimeout(() => {
        onRegisterSuccess(data.user);
      }, 1500);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-cyan-500 to-blue-600 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-pink-400 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Tarjeta Principal */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
              <span className="text-3xl">🏠</span>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent mb-1">
              Únete
            </h1>
            <p className="text-gray-500 text-sm font-medium">Crea tu cuenta en DomestiApp</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-medium animate-pulse">
              <span className="flex items-center gap-2">
                <span>⚠️</span> {error}
              </span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 text-sm font-medium">
              <span className="flex items-center gap-2">
                <span>✓</span> Cuenta creada. Redirigiendo...
              </span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                👤 Nombre Completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all bg-gray-50 hover:bg-gray-100"
                placeholder="Juan Pérez"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📧 Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all bg-gray-50 hover:bg-gray-100"
                placeholder="tu@email.com"
                required
                disabled={loading}
              />
            </div>

            {/* Rol Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                🎯 ¿Quién eres?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "cliente", label: "👤 Cliente", desc: "Solicitar servicios" },
                  { value: "profesional", label: "🛠️ Profesional", desc: "Prestar servicios" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`relative cursor-pointer p-3 rounded-xl border-2 transition-all text-center ${
                      formData.rol === opt.value
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-200 hover:border-purple-300 bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rol"
                      value={opt.value}
                      checked={formData.rol === opt.value}
                      onChange={handleChange}
                      className="sr-only"
                      disabled={loading}
                    />
                    <div className="font-bold text-gray-900">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🔐 Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all bg-gray-50 hover:bg-gray-100"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ✓ Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all bg-gray-50 hover:bg-gray-100"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 transform flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creando cuenta...
                </>
              ) : (
                <>✨ Registrarse</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-5 pt-5 border-t border-gray-200 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-xs font-medium">O</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 text-sm font-medium mt-5">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-purple-600 hover:text-purple-700 font-bold transition-colors hover:underline"
            >
              Inicia sesión →
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white text-sm font-medium opacity-75">
          <p>© 2026 DomestiApp. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
