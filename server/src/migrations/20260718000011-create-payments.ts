import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('payments', {
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
        allowNull: true,
        references: { model: 'courses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      booking_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'bookings', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      currency: { type: DataTypes.STRING(3), defaultValue: 'EGP' },
      method: { type: DataTypes.ENUM('vodafone_cash', 'instapay'), allowNull: false },
      proof_image: { type: DataTypes.STRING(500), allowNull: false },
      sender_phone: { type: DataTypes.STRING(20), allowNull: false },
      status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
      admin_notes: { type: DataTypes.TEXT, allowNull: true },
      reviewed_at: { type: DataTypes.DATE, allowNull: true },
      reviewed_by: { type: DataTypes.INTEGER, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('payments', ['user_id']);
    await queryInterface.addIndex('payments', ['status']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('payments');
  },
};
