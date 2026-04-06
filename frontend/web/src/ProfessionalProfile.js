import React, { useState, useEffect } from "react";
import API_CONFIG from "./config/api.js";
import { Card, CardHeader, CardBody } from "./components/UI/Card";
import { Input, Textarea } from "./components/UI/Input";
import { Button } from "./components/UI/Button";
import { Alert } from "./components/UI/Alert";
import { Badge } from "./components/UI/Badge";
import { useTheme } from "./context/ThemeContext.js";

function ProfessionalProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    nombre: "",
    oficio: "",
    descripcion: "",
    experiencia: "",
    tarifa: "",
    telefono: "",
    aliasPago: "",
    disponibilidad: "",
    dni: "",
    imagenes: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_CONFIG.BASE_URL}/workers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      setProfile(data);
      setFormData({
        nombre: data.nombre || "",
        oficio: data.oficio || "",
        descripcion: data.descripcion || "",
        experiencia: data.experiencia || "",
        tarifa: data.tarifa || "",
        telefono: data.telefono || "",
        aliasPago: data.aliasPago || "",
        disponibilidad: data.disponibilidad || "",
        dni: data.dni || "",
        imagenes: data.imagenes || [],
      });
    } catch (err) {
      setError("No se pudo cargar el perfil. Asegurate de tener un perfil profesional creado.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    const dataUrls = await Promise.all(
      files.map((file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
      )
    );
    const token = localStorage.getItem("token");
    const uploadedUrls = await Promise.all(
      dataUrls.map(async (dataUrl) => {
        const res = await fetch(`${API_CONFIG.BASE_URL}/uploads-api/base64-image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ dataUrl }),
        });
        if (!res.ok) throw new Error("No se pudo subir una imagen");
        const data = await res.json();
        return `${API_CONFIG.BASE_URL}${data.url}`;
      })
    );
    setFormData((prev) => ({ ...prev, imagenes: [...(prev.imagenes || []), ...uploadedUrls] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_CONFIG.BASE_URL}/workers/${profile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}`);
      }

      setProfile(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== idx),
    }));
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardBody className="text-center py-12">
          <div className="animate-pulse">
            <p className={`text-lg ${isDark ? "text-neutral-300" : "text-gray-600"}`}>
              Cargando perfil profesional...
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
          🛠️ Perfil Profesional
        </h2>
        <p className={`text-sm mt-1 ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
          Administra tu perfil y servicios
        </p>
      </CardHeader>

      <CardBody className="space-y-6 max-w-4xl">
        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">¡Perfil actualizado exitosamente!</Alert>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className={`p-4 rounded-lg ${isDark ? "bg-neutral-700" : "bg-primary-50"} border border-primary-200 dark:border-primary-600`}>
            <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              👤 Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre Completo"
                icon="✏️"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                dark={isDark}
                required
              />
              <Input
                label="📞 Teléfono"
                icon="☎️"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                dark={isDark}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="🪪 DNI"
                icon="📋"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                dark={isDark}
              />
              <Input
                label="🔧 Oficio / Especialidad"
                icon="⚙️"
                name="oficio"
                value={formData.oficio}
                onChange={handleChange}
                dark={isDark}
                required
              />
            </div>
          </div>

          {/* Información Profesional */}
          <div className={`p-4 rounded-lg ${isDark ? "bg-neutral-700" : "bg-primary-50"} border border-primary-200 dark:border-primary-600`}>
            <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              💼 Información Profesional
            </h3>
            <Textarea
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe tu experiencia y servicios..."
              dark={isDark}
              rows="4"
            />

            <div className="mt-4">
              <Textarea
                label="Experiencia"
                name="experiencia"
                value={formData.experiencia}
                onChange={handleChange}
                placeholder="Cuéntanos sobre tu experiencia laboral..."
                dark={isDark}
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="💰 Tarifa por Hora"
                icon="💵"
                name="tarifa"
                type="number"
                value={formData.tarifa}
                onChange={handleChange}
                dark={isDark}
              />
              <Input
                label="🕒 Disponibilidad"
                icon="📅"
                name="disponibilidad"
                placeholder="Ej: Lun-Vie 9-18"
                value={formData.disponibilidad}
                onChange={handleChange}
                dark={isDark}
              />
            </div>
          </div>

          {/* Información de Pago */}
          <div className={`p-4 rounded-lg ${isDark ? "bg-neutral-700" : "bg-primary-50"} border border-primary-200 dark:border-primary-600`}>
            <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              💳 Información de Pago
            </h3>
            <Input
              label="Alias / Cuenta para Cobros"
              icon="🏦"
              name="aliasPago"
              placeholder="Ej: mi.alias.mercadopago"
              value={formData.aliasPago}
              onChange={handleChange}
              dark={isDark}
            />
          </div>

          {/* Portafolio */}
          <div className={`p-4 rounded-lg ${isDark ? "bg-neutral-700" : "bg-primary-50"} border border-primary-200 dark:border-primary-600`}>
            <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              📸 Portafolio / Galería
            </h3>
            <div className={`px-4 py-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
              isDark
                ? "border-neutral-600 hover:border-primary-500 hover:bg-neutral-600/50"
                : "border-gray-300 hover:border-primary-500 hover:bg-primary-50"
            }`}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="opacity-0 w-full h-full cursor-pointer"
              />
              <div className={`pointer-events-none ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                <p className="text-lg mb-1">📷 Haz clic o arrastra imágenes</p>
                <p className="text-xs">PNG, JPG, GIF hasta 5MB</p>
              </div>
            </div>

            {formData.imagenes?.length > 0 && (
              <div className="mt-4">
                <p className={`text-sm font-semibold mb-3 ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                  {formData.imagenes.length} imagen{formData.imagenes.length !== 1 ? "es" : ""} cargada{formData.imagenes.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {formData.imagenes.map((src, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden">
                      <img
                        src={src}
                        alt={`Portafolio ${idx + 1}`}
                        className="h-24 w-full object-cover group-hover:opacity-75 transition-opacity"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <span className="text-white text-2xl font-bold">✕</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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

export default ProfessionalProfile;
