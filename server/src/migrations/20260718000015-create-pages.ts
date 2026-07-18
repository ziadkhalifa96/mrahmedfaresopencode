import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('pages', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING(255), allowNull: false },
      title_ar: { type: DataTypes.STRING(255), allowNull: false },
      slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      sections: { type: DataTypes.JSON, allowNull: true },
      seo_title: { type: DataTypes.STRING(255), allowNull: true },
      seo_title_ar: { type: DataTypes.STRING(255), allowNull: true },
      seo_description: { type: DataTypes.TEXT, allowNull: true },
      seo_description_ar: { type: DataTypes.TEXT, allowNull: true },
      is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('pages', ['slug'], { unique: true });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('pages');
  },
};
