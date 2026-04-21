import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();
const PORT = 3000;

app.use(express.json());

// MercadoPago Setup
// In a real app, this would be in .env
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const client = MP_ACCESS_TOKEN ? new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN }) : null;

app.post('/api/create-preference', async (req, res) => {
  if (!client) {
    return res.status(400).json({ error: 'MercadoPago not configured. Using simulated mode.' });
  }

  const { title, price, quantity, serviceId } = req.body;

  try {
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: serviceId,
            title: title,
            unit_price: Number(price),
            quantity: Number(quantity),
          }
        ],
        back_urls: {
          success: `${process.env.APP_URL}/payment-success`,
          failure: `${process.env.APP_URL}/payment-failure`,
          pending: `${process.env.APP_URL}/payment-pending`,
        },
        auto_return: 'approved',
      }
    });

    res.json({ id: result.id });
  } catch (error) {
    console.error('Error creating MP preference:', error);
    res.status(500).json({ error: 'Failed to create payment preference' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
