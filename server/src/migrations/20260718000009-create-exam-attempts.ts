import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('exam_attempts', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'exams', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      score: { type: DataTypes.INTEGER, allowNull: true },
      answers: { type: DataTypes.JSON, allowNull: true },
      started_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      completed_at: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('exam_attempts', ['user_id']);
    await queryInterface.addIndex('exam_attempts', ['exam_id']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('exam_attempts');
  },
};
