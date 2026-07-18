import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare phone: CreationOptional<string>;
  declare role: CreationOptional<'admin' | 'student'>;
  declare avatar: CreationOptional<string>;
  declare language: CreationOptional<'en' | 'ar'>;
  declare theme: CreationOptional<'light' | 'dark'>;
  declare isVerified: CreationOptional<boolean>;
  declare refreshToken: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    role: { type: DataTypes.ENUM('admin', 'student'), defaultValue: 'student' },
    avatar: { type: DataTypes.STRING(500), allowNull: true },
    language: { type: DataTypes.ENUM('en', 'ar'), defaultValue: 'en' },
    theme: { type: DataTypes.ENUM('light', 'dark'), defaultValue: 'light' },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    refreshToken: { type: DataTypes.TEXT, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: true,
    underscored: true,
  }
);

export default User;
