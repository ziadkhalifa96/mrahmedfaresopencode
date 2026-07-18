import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';

class LessonProgress extends Model<InferAttributes<LessonProgress>, InferCreationAttributes<LessonProgress>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<number>;
  declare lessonId: ForeignKey<number>;
  declare completed: CreationOptional<boolean>;
  declare completedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

LessonProgress.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    lessonId: { type: DataTypes.INTEGER, allowNull: false },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'lesson_progress',
    modelName: 'LessonProgress',
    timestamps: true,
    underscored: true,
  }
);

export default LessonProgress;
