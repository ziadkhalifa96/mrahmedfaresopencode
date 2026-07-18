import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('notifications', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: { type: DataTypes.STRING(255), allowNull: false },
      title_ar: { type: DataTypes.STRING(255), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      message_ar: { type: DataTypes.TEXT, allowNull: false },
      type: { type: DataTypes.ENUM('system', 'payment', 'course', 'booking'), defaultValue: 'system' },
      is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
      link: { type: DataTypes.STRING(500), allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('notifications', ['user_id']);
    await queryInterface.addIndex('notifications', ['is_read']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('notifications');
  },
};
