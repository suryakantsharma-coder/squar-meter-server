import dotenv from 'dotenv';
dotenv.config();

console.log('Mongo URI ->', process.env.JWT_SECRET);

export default {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  accessExpire: process.env.ACCESS_EXPIRE || '15m',
  refreshExpire: process.env.REFRESH_EXPIRE || '7d',
};
