import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import authRoutes from './routes/auth.routes.js';

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ ok: true, name: 'auria-api' }));
app.use('/auth', authRoutes);

app.use((req, res) => res.status(404).json({ message: 'Rota não encontrada' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno' });
});

export default app;