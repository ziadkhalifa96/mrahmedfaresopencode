import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('certificates', {
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
      certificate_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      issued_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('certificates', ['user_id']);
    await queryInterface.addIndex('certificates', ['certificate_number'], { unique: true });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('certificates');
  },
};
