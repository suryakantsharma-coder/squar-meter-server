// import express from 'express';
// import cookieParser from 'cookie-parser';
// import helmet from 'helmet';
// import config from './config';
// import { connectDB } from './database';
// import authRoutes from './routes/auth.routes';
// import projectRoutes from './routes/project.routes';
// import uploadRouter from './routes/upload.routes';
// import unitsRouter from './routes/unit.routes';
// import leadRoutes from './routes/lead.routes';
// import bookingRoutes from './routes/booking.routes';
// import cors from 'cors';

// const app = express();
// app.use(helmet());
// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: ['http://localhost:3000', 'https://zameen-brown.vercel.app'], // your frontend URL
//     credentials: true, // if you use cookies or Authorization headers
//   }),
// );

// app.use('/uploads', express.static('uploads'));

// app.use('/api/auth', authRoutes);
// app.use('/api/project', projectRoutes);
// app.use('/api/upload', uploadRouter);
// app.use('/api/unit', unitsRouter);
// app.use('/api/leads', leadRoutes);
// app.use('/api/bookings', bookingRoutes);

// app.get('/', (req, res) => res.json({ message: 'Server running 🚀' }));

// connectDB().then(() => {
//   app.listen(config.port, () => console.log(`✅ Server running on port ${config.port}`));
// });

import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import config from './config';
import { connectDB } from './database';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import uploadRouter from './routes/upload.routes';
import unitsRouter from './routes/unit.routes';
import leadRoutes from './routes/lead.routes';
import bookingRoutes from './routes/booking.routes';
import cors from 'cors';

const app = express();

// CORS FIRST - Allow all origins
app.use(
  cors({
    origin: true, // Allows all origins
    credentials: true, // Keeps cookies/auth headers working
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Handle preflight requests
app.options('*', cors());

// Then other middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/upload', uploadRouter);
app.use('/api/unit', unitsRouter);
app.use('/api/leads', leadRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => res.json({ message: 'Server running 🚀' }));

connectDB().then(() => {
  app.listen(config.port, () => console.log(`✅ Server running on port ${config.port}`));
});
