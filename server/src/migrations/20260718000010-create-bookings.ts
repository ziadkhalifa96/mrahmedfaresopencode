import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('bookings', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: { type: DataTypes.ENUM('offline', 'online'), allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      time: { type: DataTypes.STRING(10), allowNull: false },
      duration: { type: DataTypes.INTEGER, defaultValue: 60 },
      max_seats: { type: DataTypes.INTEGER, allowNull: false },
      booked_seats: { type: DataTypes.INTEGER, defaultValue: 0 },
      status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'), defaultValue: 'pending' },
      daily_room_url: { type: DataTypes.STRING(500), allowNull: true },
      location: { type: DataTypes.STRING(500), allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('bookings', ['user_id']);
    await queryInterface.addIndex('bookings', ['date']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('bookings');
  },
};
