# DomestiApp

Marketplace de servicios domésticos con roles (`cliente`, `profesional`, `admin`), chat en tiempo real y flujo de pagos con MercadoPago (modo real o simulado).

## Stack

- Backend: Node.js, Express, LowDB, JWT, Socket.IO, Joi
- Frontend: React
- Pagos: MercadoPago (si hay token), fallback simulado (si no hay token)
- Almacenamiento de imágenes: carpeta local `backend/uploads`

## Estructura

- `backend`: API, sockets, lógica de negocio
- `frontend/web`: aplicación React

## Funcionalidades implementadas

- Auth completa (`register/login`) con JWT.
- Roles y autorización por ruta.
- Perfil de usuario cliente (`GET/PUT /users/profile`).
- Perfil profesional/worker (`GET /workers/me`, `POST/PUT /workers`).
- Solicitudes de servicio (crear/listar/aceptar/completar/cancelar).
- Chat en tiempo real por servicio (solo cuando está asignado).
- Transacciones y comisiones.
- Panel admin para gestionar usuarios, workers, solicitudes y payouts.
- Subida de imágenes a storage local + URLs públicas.
- Filtros y paginación en listados principales.

---

## Requisitos

- Node.js 18+ (recomendado)
- npm

## Variables de entorno

Crear `backend/.env` (opcional, pero recomendado):

```env
PORT=5000
JWT_SECRET=claveSuperSecreta
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
MP_ACCESS_TOKEN=
```

Notas:
- Si `MP_ACCESS_TOKEN` está vacío: pagos en modo simulado (aprobación automática).
- Si `MP_ACCESS_TOKEN` está configurado: se crea checkout real de MercadoPago.

---

## Cómo correr el proyecto

### 1) Instalar dependencias

Desde la raíz:

```bash
npm install
```

También podés instalar por separado:

```bash
cd backend && npm install
cd ../frontend/web && npm install
```

### 2) Levantar backend

En una terminal:

```bash
cd backend
npm run dev
```

Servidor API en: `http://localhost:5000`

### 3) Levantar frontend

En otra terminal:

```bash
cd frontend/web
npm start
```

Web en: `http://localhost:3000`

### 4) Build de verificación (opcional)

```bash
cd frontend/web
npm run build
```

---

## Seed (datos de prueba)

Este seed carga usuarios (cliente/profesional/admin), el worker del profesional, requests de servicios (pendiente/aceptado/completado) y mensajes/transacciones para que puedas probar todo de una.

1. En una terminal:

```bash
cd backend
npm run seed
```

Esto sobrescribe `backend/db.json`.

Credenciales para iniciar sesión:

- Cliente demo: `cliente@test.com` / `12345678`
- Profesional demo: `profesional@test.com` / `12345678`
- Admin demo: `admin@test.com` / `admin123`

---

## Qué páginas/pantallas vas a poder ver

La app no usa rutas tipo `/login` en URL; se maneja en una sola SPA con vistas internas.

### Público (sin sesión)

- Pantalla de Login
- Pantalla de Registro

### Cliente (al iniciar sesión)

Tabs en Dashboard:
- `Solicitudes de Servicios` (lista, filtros, paginación)
- `Solicitar Servicio` (crear solicitud con fotos)
- `Transacciones` (historial de pagos)
- `Perfil` (editar nombre, ubicación, teléfono, métodos de pago)

Acciones relevantes:
- Aceptar/completar/cancelar flujo según estado
- Pagar servicio completado
- Abrir chat con profesional asignado

### Profesional (al iniciar sesión)

Tabs en Dashboard:
- `Solicitudes de Servicios` (pendientes + asignadas)
- `Transacciones`
- `Perfil` (ficha profesional)
- `Mi Perfil` (gestión de workers/listado)

Acciones relevantes:
- Aceptar trabajo
- Chatear con cliente cuando el servicio esté asignado

### Admin (al iniciar sesión)

Tabs en Dashboard:
- `Administración`
  - Gestión de usuarios y roles
  - Gestión de solicitudes y estado
  - Vista de profesionales
  - Reporte de payouts/comisiones

---

## Endpoints principales

- Auth/usuarios:
  - `POST /users/register`
  - `POST /users/login`
  - `GET /users/profile`
  - `PUT /users/profile`
- Workers:
  - `GET /workers`
  - `GET /workers/me`
  - `POST /workers`
  - `PUT /workers/:id`
- Servicios:
  - `GET /services`
  - `POST /services`
  - `POST /services/:id/accept`
  - `POST /services/:id/complete`
  - `POST /services/:id/cancel`
- Chat:
  - `GET /chat/service/:serviceId`
  - `POST /chat/send`
  - Socket.IO room por servicio
- Pagos:
  - `POST /payments/pay-service`
  - `GET /payments/transactions/:userId`
  - `POST /payments/webhook`
- Admin:
  - `GET /admin/users`
  - `PUT /admin/users/role`
  - `GET /admin/workers`
  - `GET /admin/services`
  - `PUT /admin/services/status`
  - `GET /admin/payouts`

---

## Flujo de pruebas recomendado

1. Registrar un `cliente` y un `profesional`.
2. Cliente crea una solicitud.
3. Profesional acepta la solicitud.
4. Cliente marca como completado.
5. Cliente paga:
   - con token MP: redirige a checkout real
   - sin token MP: se aprueba automáticamente en simulado
6. Revisar transacciones y payouts en admin.
7. Probar chat en servicio asignado.

---

## Notas

- El almacenamiento de imágenes es local (no S3/CDN).
- Base de datos actual: `LowDB` (`backend/db.json`).
- Proyecto listo para demo funcional end-to-end en local.