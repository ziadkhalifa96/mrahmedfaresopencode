import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      role: { type: DataTypes.ENUM('admin', 'student'), defaultValue: 'student' },
      avatar: { type: DataTypes.STRING(500), allowNull: true },
      language: { type: DataTypes.ENUM('en', 'ar'), defaultValue: 'en' },
      theme: { type: DataTypes.ENUM('light', 'dark'), defaultValue: 'light' },
      is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      refresh_token: { type: DataTypes.TEXT, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('users');
  },
};
