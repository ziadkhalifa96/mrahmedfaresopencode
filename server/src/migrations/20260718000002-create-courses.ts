import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('courses', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING(255), allowNull: false },
      title_ar: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      description_ar: { type: DataTypes.TEXT, allowNull: false },
      slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      thumbnail: { type: DataTypes.STRING(500), allowNull: true },
      price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      is_free: { type: DataTypes.BOOLEAN, defaultValue: false },
      is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('courses');
  },
};
