import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('enrollments', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'courses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: { type: DataTypes.ENUM('active', 'completed'), defaultValue: 'active' },
      enrolled_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      completed_at: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('enrollments', ['user_id']);
    await queryInterface.addIndex('enrollments', ['course_id']);
    await queryInterface.addConstraint('enrollments', {
      fields: ['user_id', 'course_id'],
      type: 'unique',
      name: 'unique_user_course_enrollment',
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('enrollments');
  },
};
