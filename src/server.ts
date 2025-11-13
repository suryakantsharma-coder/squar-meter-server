import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import config from './config';
import { connectDB } from './database';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import uploadRouter from './routes/upload.routes';
import cors from 'cors';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000', // your frontend URL
    credentials: true, // if you use cookies or Authorization headers
  }),
);

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/upload', uploadRouter);

app.get('/', (req, res) => res.json({ message: 'Server running 🚀' }));

connectDB().then(() => {
  app.listen(config.port, () => console.log(`✅ Server running on port ${config.port}`));
});
