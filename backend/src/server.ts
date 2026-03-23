import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';
import { authMiddleware } from './middleware/auth.middleware';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

import path from 'path';
import configRoutes from './routes/config.routes';

/* Enable local uploads retrieval */
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

/* Routes */
app.use('/api', authRoutes);
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/config', authMiddleware, configRoutes);

/* Error handler (always last) */
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});