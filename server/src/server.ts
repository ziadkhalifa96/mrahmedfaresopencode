import app from './app';
import { env } from './config/env';
import { sequelize } from './models';

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Sync models (use migrations in production)
    if (env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synced');
    }

    // Start server
    const PORT = env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

startServer();
