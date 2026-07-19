import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('page_content', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      page: { type: DataTypes.STRING(50), allowNull: false },
      section: { type: DataTypes.STRING(50), allowNull: false },
      key: { type: DataTypes.STRING(100), allowNull: false },
      value_en: { type: DataTypes.TEXT, allowNull: false },
      value_ar: { type: DataTypes.TEXT, allowNull: false },
      metadata: { type: DataTypes.JSON, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('page_content', ['page', 'section', 'key'], { unique: true });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('page_content');
  },
};
