import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database';

class Course extends Model<InferAttributes<Course>, InferCreationAttributes<Course>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare titleAr: string;
  declare description: string;
  declare descriptionAr: string;
  declare slug: string;
  declare thumbnail: CreationOptional<string>;
  declare price: CreationOptional<number>;
  declare isFree: CreationOptional<boolean>;
  declare isPublished: CreationOptional<boolean>;
  declare orderIndex: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Course.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    titleAr: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    descriptionAr: { type: DataTypes.TEXT, allowNull: false },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    thumbnail: { type: DataTypes.STRING(500), allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    isFree: { type: DataTypes.BOOLEAN, defaultValue: false },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'courses',
    modelName: 'Course',
    timestamps: true,
    underscored: true,
  }
);

export default Course;
