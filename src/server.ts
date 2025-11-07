import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import config from './config';
import { connectDB } from './database';
import authRoutes from './routes/auth.routes';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.json({ message: 'Server running 🚀' }));

connectDB().then(() => {
  app.listen(config.port, () => console.log(`✅ Server running on port ${config.port}`));
});
