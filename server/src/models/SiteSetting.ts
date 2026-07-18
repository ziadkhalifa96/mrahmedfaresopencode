import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database';

class SiteSetting extends Model<InferAttributes<SiteSetting>, InferCreationAttributes<SiteSetting>> {
  declare id: CreationOptional<number>;
  declare key: string;
  declare value: object;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SiteSetting.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    value: { type: DataTypes.JSON, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'site_settings',
    modelName: 'SiteSetting',
    timestamps: true,
    underscored: true,
  }
);

export default SiteSetting;
