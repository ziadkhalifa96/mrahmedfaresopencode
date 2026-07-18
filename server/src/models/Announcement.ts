import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database';

class Announcement extends Model<InferAttributes<Announcement>, InferCreationAttributes<Announcement>> {
  declare id: CreationOptional<number>;
  declare message: string;
  declare messageAr: string;
  declare isActive: CreationOptional<boolean>;
  declare link: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Announcement.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    messageAr: { type: DataTypes.TEXT, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    link: { type: DataTypes.STRING(500), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'announcements',
    modelName: 'Announcement',
    timestamps: true,
    underscored: true,
  }
);

export default Announcement;
