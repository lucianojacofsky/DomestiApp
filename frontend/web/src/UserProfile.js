import React, { useState, useEffect } from "react";
import API_CONFIG from "./config/api.js";
import { Card, CardHeader, CardBody } from "./components/UI/Card";
import { Input } from "./components/UI/Input";
import { Button } from "./components/UI/Button";
import { Alert } from "./components/UI/Alert";
import { Badge } from "./components/UI/Badge";
import { useTheme } from "./context/ThemeContext.js";

function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    telefono: "",
    metodosPago: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_CONFIG.BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      setFormData({
        nombre: data.nombre || "",
        ubicacion: data.ubicacion || "",
        telefono: data.telefono || "",
        metodosPago: data.metodosPago || [],
      });
    } catch (err) {
      setError("No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetodoPagoChange = (index, field, value) => {
    setFormData((prev) => {
      const metodos = [...(prev.metodosPago || [])];
      if (!metodos[index]) metodos[index] = { tipo: "mercadopago", alias: "" };
      metodos[index][field] = value;
      return { ...prev, metodosPago: metodos };
    });
  };

  const addMetodoPago = () => {
    setFormData((prev) => ({
      ...prev,
      metodosPago: [...(prev.metodosPago || []), { tipo: "mercadopago", alias: "" }],
    }));
  };

  const removeMetodoPago = (index) => {
    setFormData((prev) => ({
      ...prev,
      metodosPago: prev.metodosPago.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_CONFIG.BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardBody className="text-center py-12">
          <div className="animate-pulse">
            <p className={`text-lg ${isDark ? "text-neutral-300" : "text-gray-600"}`}>
              Cargando perfil...
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          👤 Mi Perfil
        </h2>
        <p className={`text-sm mt-1 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
          Administra tu información personal
        </p>
      </CardHeader>

      <CardBody className="space-y-6 max-w-2xl">
        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">¡Perfil actualizado exitosamente!</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="👤 Nombre Completo"
            icon="✏️"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            dark={isDark}
            required
          />

          <Input
            label="📍 Ubicación"
            icon="🗺️"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            dark={isDark}
          />

          <Input
            label="📞 Teléfono"
            icon="☎️"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            dark={isDark}
          />

          {/* Métodos de pago */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={`text-sm font-semibold ${isDark ? "text-neutral-200" : "text-gray-700"}`}>
                💳 Métodos de Pago
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMetodoPago}
              >
                + Agregar
              </Button>
            </div>

            {(formData.metodosPago || []).length === 0 ? (
              <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                No hay métodos de pago configurados
              </p>
            ) : (
              (formData.metodosPago || []).map((mp, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    isDark ? "bg-neutral-700 border-neutral-600" : "bg-gray-50 border-gray-200"
                  } flex gap-3 items-end`}
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <label className={`text-xs font-semibold ${isDark ? "text-neutral-300" : "text-gray-700"} block mb-1`}>
                        Tipo
                      </label>
                      <select
                        value={mp.tipo}
                        onChange={(e) => handleMetodoPagoChange(index, "tipo", e.target.value)}
                        className={`w-full px-3 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                          isDark
                            ? "bg-neutral-600 border-neutral-500 text-white focus:border-primary-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-primary-500"
                        }`}
                      >
                        <option value="mercadopago">💰 MercadoPago</option>
                        <option value="transferencia">🏦 Transferencia</option>
                        <option value="efectivo">💵 Efectivo</option>
                      </select>
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${isDark ? "text-neutral-300" : "text-gray-700"} block mb-1`}>
                        Alias / Cuenta
                      </label>
                      <input
                        value={mp.alias}
                        onChange={(e) => handleMetodoPagoChange(index, "alias", e.target.value)}
                        placeholder="Ej: mi.alias.mp"
                        className={`w-full px-3 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                          isDark
                            ? "bg-neutral-600 border-neutral-500 text-white placeholder-neutral-400 focus:border-primary-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-primary-500"
                        }`}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeMetodoPago(index)}
                  >
                    🗑️
                  </Button>
                </div>
              ))
            )}
          </div>

          <Button
            type="submit"
            disabled={saving}
            loading={saving}
            className="w-full"
          >
            {saving ? "Guardando..." : "✓ Guardar Cambios"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

export default UserProfile;
