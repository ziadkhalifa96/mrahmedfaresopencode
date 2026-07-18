import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('announcements', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      message: { type: DataTypes.TEXT, allowNull: false },
      message_ar: { type: DataTypes.TEXT, allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      link: { type: DataTypes.STRING(500), allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('announcements');
  },
};
