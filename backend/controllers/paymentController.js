import { db } from "../server.js";
import Transaction from "../models/transaction.js";
// import mercadopago from "mercadopago";

// Configurar MercadoPago
// if (process.env.MP_ACCESS_TOKEN) {
//   mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);
// }

export const crearPago = async (req, res) => {
  const { clienteId, profesionalId, servicioId, montoTotal } = req.body;

  const montoComision = montoTotal * 0.10;
  const montoProfesional = montoTotal - montoComision;

  const nuevaTransaccion = new Transaction({
    id: Date.now().toString(),
    clienteId,
    profesionalId,
    servicioId,
    montoTotal,
    montoComision,
    montoProfesional,
    estado: "pendiente",
    fecha: new Date().toISOString()
  });

  await db.read();
  db.data.transactions.push(nuevaTransaccion);
  await db.write();

  try {
    // const preference = await mercadopago.preferences.create({
    //   items: [
    //     {
    //       title: "Servicio DomestiApp",
    //       quantity: 1,
    //       currency_id: "ARS",
    //       unit_price: montoTotal
    //     }
    //   ],
    //   back_urls: {
    //     success: "http://localhost:3000/success",
    //     failure: "http://localhost:3000/failure",
    //     pending: "http://localhost:3000/pending"
    //   },
    //   auto_return: "approved"
    // });

    // res.json({ id: nuevaTransaccion.id, init_point: preference.body.init_point });
    res.json({ id: nuevaTransaccion.id, message: "Pago simulado creado" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear pago", detalle: error.message });
  }
};

export const obtenerTransacciones = async (req, res) => {
  const { userId } = req.params;

  try {
    await db.read();
    const transactions = db.data.transactions.filter(t =>
      t.clienteId === userId || t.profesionalId === userId
    );
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener transacciones" });
  }
};

export const pagarServicio = async (req, res) => {
  const { servicioId } = req.body;
  const clienteId = req.user.id;

  try {
    await db.read();
    const service = db.data.serviceRequests.find(s => s.id === servicioId);

    if (!service || service.clienteId !== clienteId || service.estado !== "completado") {
      return res.status(400).json({ error: "Servicio no válido para pago" });
    }

    if (!service.presupuestoOferido) {
      return res.status(400).json({ error: "No hay presupuesto definido" });
    }

    // Verificar si ya existe una transacción
    const existingTransaction = db.data.transactions.find(t => t.servicioId === servicioId);
    if (existingTransaction) {
      return res.status(400).json({ error: "Ya existe una transacción para este servicio" });
    }

    const montoTotal = service.presupuestoOferido;

    const montoComision = montoTotal * 0.10;
    const montoProfesional = montoTotal - montoComision;

    const nuevaTransaccion = new Transaction({
      id: Date.now().toString(),
      clienteId,
      profesionalId: service.profesionalId,
      servicioId,
      montoTotal,
      montoComision,
      montoProfesional,
      estado: "pendiente",
      fecha: new Date().toISOString()
    });

    db.data.transactions.push(nuevaTransaccion);
    await db.write();

    // const preference = await mercadopago.preferences.create({
    //   items: [
    //     {
    //       title: `Servicio ${service.tipoServicio}`,
    //       quantity: 1,
    //       currency_id: "ARS",
    //       unit_price: montoTotal
    //     }
    //   ],
    //   back_urls: {
    //     success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
    //     failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/failure`,
    //     pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/pending`
    //   },
    //   auto_return: "approved",
    //   external_reference: nuevaTransaccion.id
    // });

    // res.json({
    //   transactionId: nuevaTransaccion.id,
    //   init_point: preference.body.init_point
    // });
    res.json({
      transactionId: nuevaTransaccion.id,
      message: "Pago simulado iniciado"
    });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar pago", detalle: error.message });
  }
};