import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('blog_posts', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING(255), allowNull: false },
      title_ar: { type: DataTypes.STRING(255), allowNull: false },
      slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      content: { type: DataTypes.TEXT('long'), allowNull: false },
      content_ar: { type: DataTypes.TEXT('long'), allowNull: false },
      thumbnail: { type: DataTypes.STRING(500), allowNull: true },
      excerpt: { type: DataTypes.TEXT, allowNull: true },
      excerpt_ar: { type: DataTypes.TEXT, allowNull: true },
      is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('blog_posts', ['slug'], { unique: true });
    await queryInterface.addIndex('blog_posts', ['author_id']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('blog_posts');
  },
};
