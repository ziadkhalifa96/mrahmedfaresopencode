import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('site_settings', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      value: { type: DataTypes.JSON, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('site_settings', ['key'], { unique: true });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('site_settings');
  },
};
