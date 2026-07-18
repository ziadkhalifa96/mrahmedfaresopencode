import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'ahmed_fares_academy',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'access-secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',
  ULTRAMSG_INSTANCE_ID: process.env.ULTRAMSG_INSTANCE_ID || '',
  ULTRAMSG_TOKEN: process.env.ULTRAMSG_TOKEN || '',
  ULTRAMSG_URL: process.env.ULTRAMSG_URL || 'https://api.ultramsg.com',
  DAILY_API_KEY: process.env.DAILY_API_KEY || '',
  VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:3000/api',
};
