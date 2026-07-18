import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('exam_questions', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'exams', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      question: { type: DataTypes.TEXT, allowNull: false },
      question_ar: { type: DataTypes.TEXT, allowNull: false },
      type: { type: DataTypes.ENUM('mcq', 'true_false'), defaultValue: 'mcq' },
      options: { type: DataTypes.JSON, allowNull: true },
      correct_answer: { type: DataTypes.STRING(50), allowNull: false },
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('exam_questions', ['exam_id']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('exam_questions');
  },
};
