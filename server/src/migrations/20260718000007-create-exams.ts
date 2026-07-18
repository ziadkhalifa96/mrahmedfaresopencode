import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('exams', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'courses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: { type: DataTypes.STRING(255), allowNull: false },
      title_ar: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      description_ar: { type: DataTypes.TEXT, allowNull: true },
      duration: { type: DataTypes.INTEGER, allowNull: false },
      passing_score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 50 },
      max_attempts: { type: DataTypes.INTEGER, defaultValue: 3 },
      is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('exams', ['course_id']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('exams');
  },
};
