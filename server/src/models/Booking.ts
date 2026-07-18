import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';

class Booking extends Model<InferAttributes<Booking>, InferCreationAttributes<Booking>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<number>;
  declare type: 'offline' | 'online';
  declare date: Date;
  declare time: string;
  declare duration: CreationOptional<number>;
  declare maxSeats: number;
  declare bookedSeats: CreationOptional<number>;
  declare status: CreationOptional<'pending' | 'confirmed' | 'cancelled'>;
  declare dailyRoomUrl: CreationOptional<string>;
  declare location: CreationOptional<string>;
  declare notes: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Booking.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('offline', 'online'), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.STRING(10), allowNull: false },
    duration: { type: DataTypes.INTEGER, defaultValue: 60 },
    maxSeats: { type: DataTypes.INTEGER, allowNull: false },
    bookedSeats: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'), defaultValue: 'pending' },
    dailyRoomUrl: { type: DataTypes.STRING(500), allowNull: true },
    location: { type: DataTypes.STRING(500), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'bookings',
    modelName: 'Booking',
    timestamps: true,
    underscored: true,
  }
);

export default Booking;
