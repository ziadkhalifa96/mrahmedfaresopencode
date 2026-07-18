import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';

class Notification extends Model<InferAttributes<Notification>, InferCreationAttributes<Notification>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<number>;
  declare title: string;
  declare titleAr: string;
  declare message: string;
  declare messageAr: string;
  declare type: CreationOptional<'system' | 'payment' | 'course' | 'booking'>;
  declare isRead: CreationOptional<boolean>;
  declare link: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Notification.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    titleAr: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    messageAr: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.ENUM('system', 'payment', 'course', 'booking'), defaultValue: 'system' },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    link: { type: DataTypes.STRING(500), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'notifications',
    modelName: 'Notification',
    timestamps: true,
    underscored: true,
  }
);

export default Notification;
