# DomestiApp 🏠

DomestiApp es una plataforma integral diseñada para conectar a clientes que necesitan servicios domésticos con profesionales calificados. La aplicación gestiona todo el ciclo de vida del servicio, desde la solicitud inicial hasta el pago final y la reseña del profesional.

## 🚀 Características Principales

- **Gestión de Perfiles**: Tres roles especializados (Cliente, Profesional y Administrador).
- **Solicitudes de Trabajo**: Los clientes pueden crear pedidos detallados con descripción, fotos y ubicación.
- **Chat en Tiempo Real**: Comunicación directa entre cliente y profesional asignado mediante Firebase.
- **Sistema de Pagos**: Integración con MercadoPago para transacciones seguras.
- **Reseñas y Calificaciones**: Sistema de feedback para garantizar la calidad del servicio.
- **Panel de Control**: Dashboards personalizados según el rol del usuario.
- **Diseño Premium**: Interfaz moderna construida con Tailwind CSS y componentes de shadcn/ui.

## 🛠️ Tecnologías

- **Frontend**: React 19, Vite, Tailwind CSS v4, Motion.
- **Varios**: shadcn/ui, Lucide React, Sonner.
- **Backend/Base de Datos**: Firebase (Auth, Firestore, Hosting).
- **Integraciones**: SDK de MercadoPago, Google Gemini AI.

## 💻 Instalación Local

Sigue estos pasos para correr DomestiApp en tu computadora:

### Pre-requisitos
- Node.js (v18 o superior)
- Una cuenta de Firebase

### Pasos
1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd domestiapp
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env` en la raíz basado en `.env.example`:
   ```env
   GEMINI_API_KEY="tu_clave_de_gemini"
   MERCADOPAGO_ACCESS_TOKEN="tu_token_de_mercadopago"
   ```

4. **Configurar Firebase**:
   - Crea un proyecto en la consola de Firebase.
   - Habilita **Authentication** (Google Login).
   - Crea una base de datos **Firestore**.
   - Descarga la configuración de tu app web y crea un archivo llamado `src/lib/firebase-config.json` (o actualiza los valores en el código).

5. **Correr la aplicación**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

## 👥 Usuarios de Prueba (Credenciales de Ejemplo)

Para probar todas las funcionalidades, puedes utilizar o registrar estos perfiles:

### 1. Administrador (Admin)
- **Email**: `admin@ejemplo.com`
- **Contraseña**: `admin123456`
- **Rol**: Acceso total al panel de control, supervisión de usuarios y transacciones.

### 2. Profesional
- **Email**: `profesional@ejemplo.com`
- **Contraseña**: `pro123456`
- **Funciones**: Aceptar trabajos, gestionar estados, chatear y recibir pagos.

### 3. Cliente
- **Email**: `cliente@ejemplo.com`
- **Contraseña**: `cliente123456`
- **Funciones**: Crear solicitudes, pagar servicios, chatear y calificar profesionales.

---
Desarrollado con ❤️ para DomestiApp.
