import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('chapters', {
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
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('chapters', ['course_id']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('chapters');
  },
};
