import bcrypt from "bcryptjs";
import { Low, JSONFile } from "lowdb";
import { v4 as uuidv4 } from "uuid";

const hashPassword = async (password) => bcrypt.hash(password, 10);

async function main() {
  const adapter = new JSONFile("db.json");
  const db = new Low(adapter, {});

  await db.read();

  // --- Usuarios ---
  const clienteId = uuidv4();
  const profesionalId = uuidv4();
  const adminId = uuidv4();

  const passwordCliente = "12345678";
  const passwordProfesional = "12345678";
  const passwordAdmin = "admin123";

  const users = [
    {
      id: clienteId,
      nombre: "Cliente Demo",
      email: "cliente@test.com",
      password: await hashPassword(passwordCliente),
      rol: "cliente",
      ubicacion: "Barrio Centro",
      telefono: "111111111",
      metodosPago: [{ tipo: "mercadopago", alias: "cliente-mp" }],
      creadoEn: new Date().toISOString(),
    },
    {
      id: profesionalId,
      nombre: "Profesional Demo",
      email: "profesional@test.com",
      password: await hashPassword(passwordProfesional),
      rol: "profesional",
      ubicacion: "Barrio Norte",
      telefono: "222222222",
      metodosPago: [{ tipo: "mercadopago", alias: "pro-mp" }],
      creadoEn: new Date().toISOString(),
    },
    {
      id: adminId,
      nombre: "Admin Demo",
      email: "admin@test.com",
      password: await hashPassword(passwordAdmin),
      rol: "admin",
      ubicacion: null,
      telefono: null,
      metodosPago: [],
      creadoEn: new Date().toISOString(),
    },
  ];

  // --- Workers (ficha del profesional) ---
  const workerId = uuidv4();
  const workers = [
    {
      id: workerId,
      userId: profesionalId,
      nombre: "Profesional Demo",
      oficio: "Plomero",
      descripcion: "Experto en reparaciones y mantenimiento del hogar.",
      experiencia: "5 años de experiencia en instalaciones y reparaciones.",
      imagenes: [],
      aliasPago: "pro-mp",
      telefono: "333333333",
      tarifa: 25000,
      disponibilidad: "Lun-Vie 9-18",
      dni: "12345678",
      verificado: false,
      creadoEn: new Date().toISOString(),
    },
  ];

  // --- ServiceRequests ---
  const srPendiente = uuidv4();
  const srAceptado = uuidv4();
  const srCompletadoPagoPendiente = uuidv4();
  const srCompletadoPagado = uuidv4();

  const now = new Date();
  const plusDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000).toISOString();

  const serviceRequests = [
    {
      id: srPendiente,
      clienteId,
      profesionalId: null,
      tipoServicio: "Plomería",
      descripcion: "Tengo una pérdida de agua en el baño.",
      ubicacion: "Calle Falsa 123",
      fotos: [],
      presupuestoOferido: null,
      estado: "pendiente",
      fechaSolicitud: new Date().toISOString(),
      fechaCompromiso: null,
      calificacion: null,
      comentario: null,
      pagoEstado: "pendiente",
      pagadoEn: null,
    },
    {
      id: srAceptado,
      clienteId,
      profesionalId,
      tipoServicio: "Plomería",
      descripcion: "Arreglo de canilla y revisión de cañerías.",
      ubicacion: "Calle Falsa 456",
      fotos: [],
      presupuestoOferido: 50000,
      estado: "aceptado",
      fechaSolicitud: new Date().toISOString(),
      fechaCompromiso: plusDays(1),
      calificacion: null,
      comentario: null,
      pagoEstado: "pendiente",
      pagadoEn: null,
    },
    {
      id: srCompletadoPagoPendiente,
      clienteId,
      profesionalId,
      tipoServicio: "Plomería",
      descripcion: "Reparación de desagüe en cocina.",
      ubicacion: "Calle Falsa 789",
      fotos: [],
      presupuestoOferido: 60000,
      estado: "completado",
      fechaSolicitud: plusDays(-2),
      fechaCompromiso: plusDays(-1),
      calificacion: 4,
      comentario: "Buen trabajo, llegó a horario.",
      pagoEstado: "pendiente",
      pagadoEn: null,
    },
    {
      id: srCompletadoPagado,
      clienteId,
      profesionalId,
      tipoServicio: "Plomería",
      descripcion: "Instalación de grifería nueva.",
      ubicacion: "Calle Falsa 321",
      fotos: [],
      presupuestoOferido: 70000,
      estado: "completado",
      fechaSolicitud: plusDays(-5),
      fechaCompromiso: plusDays(-4),
      calificacion: 5,
      comentario: "Excelente atención y resultado.",
      pagoEstado: "pagado",
      pagadoEn: plusDays(-3),
    },
  ];

  // --- Mensajes de chat ---
  const messages = [
    {
      id: uuidv4(),
      remitenteId: clienteId,
      destinatarioId: profesionalId,
      servicioId: srAceptado,
      contenido: "Hola, ¿tenés disponibilidad esta semana?",
      fecha: plusDays(-1),
      tipo: "texto",
      leido: false,
    },
    {
      id: uuidv4(),
      remitenteId: profesionalId,
      destinatarioId: clienteId,
      servicioId: srAceptado,
      contenido: "Sí. Te propongo mañana a la tarde.",
      fecha: plusDays(-1),
      tipo: "texto",
      leido: false,
    },
    {
      id: uuidv4(),
      remitenteId: clienteId,
      destinatarioId: profesionalId,
      servicioId: srCompletadoPagado,
      contenido: "Gracias por el servicio!",
      fecha: plusDays(-3),
      tipo: "texto",
      leido: true,
    },
  ];

  // --- Transacciones (para que el admin vea payouts desde el inicio) ---
  const tx1 = {
    id: uuidv4(),
    clienteId,
    profesionalId,
    servicioId: srCompletadoPagado,
    montoTotal: 70000,
    montoComision: 7000,
    montoProfesional: 63000,
    estado: "aprobada",
    fecha: plusDays(-3),
  };

  db.data = {
    users,
    workers,
    serviceCategories: [],
    professionalProfiles: [],
    serviceRequests,
    reviews: [],
    messages,
    transactions: [tx1],
  };

  await db.write();
  console.log("Seed cargado en backend/db.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

