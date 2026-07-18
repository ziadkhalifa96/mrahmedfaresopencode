import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('lesson_progress', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'lessons', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      completed: { type: DataTypes.BOOLEAN, defaultValue: false },
      completed_at: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('lesson_progress', ['user_id']);
    await queryInterface.addIndex('lesson_progress', ['lesson_id']);
    await queryInterface.addConstraint('lesson_progress', {
      fields: ['user_id', 'lesson_id'],
      type: 'unique',
      name: 'unique_user_lesson_progress',
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('lesson_progress');
  },
};
