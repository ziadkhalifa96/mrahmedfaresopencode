import { sequelize } from '../src/models';

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error('Test DB connection failed:', error);
  }
});

afterAll(async () => {
  await sequelize.close();
});
