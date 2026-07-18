import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';

class ExamAttempt extends Model<InferAttributes<ExamAttempt>, InferCreationAttributes<ExamAttempt>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<number>;
  declare examId: ForeignKey<number>;
  declare score: CreationOptional<number>;
  declare answers: CreationOptional<object>;
  declare startedAt: CreationOptional<Date>;
  declare completedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ExamAttempt.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    examId: { type: DataTypes.INTEGER, allowNull: false },
    score: { type: DataTypes.INTEGER, allowNull: true },
    answers: { type: DataTypes.JSON, allowNull: true },
    startedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'exam_attempts',
    modelName: 'ExamAttempt',
    timestamps: true,
    underscored: true,
  }
);

export default ExamAttempt;
