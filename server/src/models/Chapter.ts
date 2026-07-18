import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';

class Chapter extends Model<InferAttributes<Chapter>, InferCreationAttributes<Chapter>> {
  declare id: CreationOptional<number>;
  declare courseId: ForeignKey<number>;
  declare title: string;
  declare titleAr: string;
  declare orderIndex: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Chapter.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    titleAr: { type: DataTypes.STRING(255), allowNull: false },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'chapters',
    modelName: 'Chapter',
    timestamps: true,
    underscored: true,
  }
);

export default Chapter;
