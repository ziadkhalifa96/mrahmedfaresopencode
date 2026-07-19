import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('hero_slides', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title_en: { type: DataTypes.STRING(200), allowNull: false },
      title_ar: { type: DataTypes.STRING(200), allowNull: false },
      subtitle_en: { type: DataTypes.TEXT, allowNull: false },
      subtitle_ar: { type: DataTypes.TEXT, allowNull: false },
      cta_text_en: { type: DataTypes.STRING(100), allowNull: false },
      cta_text_ar: { type: DataTypes.STRING(100), allowNull: false },
      cta_link: { type: DataTypes.STRING(200), allowNull: false, defaultValue: '/courses' },
      bg_gradient: { type: DataTypes.STRING(200), allowNull: false, defaultValue: 'from-primary via-primary-dark to-blue-900' },
      image_url: { type: DataTypes.STRING(500), allowNull: true },
      order_index: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('hero_slides', ['is_active', 'order_index']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('hero_slides');
  },
};
