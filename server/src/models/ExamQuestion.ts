import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';

class ExamQuestion extends Model<InferAttributes<ExamQuestion>, InferCreationAttributes<ExamQuestion>> {
  declare id: CreationOptional<number>;
  declare examId: ForeignKey<number>;
  declare question: string;
  declare questionAr: string;
  declare type: CreationOptional<'mcq' | 'true_false'>;
  declare options: CreationOptional<object>;
  declare correctAnswer: string;
  declare orderIndex: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ExamQuestion.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    examId: { type: DataTypes.INTEGER, allowNull: false },
    question: { type: DataTypes.TEXT, allowNull: false },
    questionAr: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.ENUM('mcq', 'true_false'), defaultValue: 'mcq' },
    options: { type: DataTypes.JSON, allowNull: true },
    correctAnswer: { type: DataTypes.STRING(50), allowNull: false },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'exam_questions',
    modelName: 'ExamQuestion',
    timestamps: true,
    underscored: true,
  }
);

export default ExamQuestion;
