import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('lessons', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      chapter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'chapters', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: { type: DataTypes.STRING(255), allowNull: false },
      title_ar: { type: DataTypes.STRING(255), allowNull: false },
      type: { type: DataTypes.ENUM('video', 'text', 'quiz', 'exam'), defaultValue: 'text' },
      content: { type: DataTypes.TEXT('long'), allowNull: true },
      content_ar: { type: DataTypes.TEXT('long'), allowNull: true },
      video_url: { type: DataTypes.STRING(500), allowNull: true },
      duration: { type: DataTypes.INTEGER, defaultValue: 0 },
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
      is_free: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('lessons', ['chapter_id']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('lessons');
  },
};
