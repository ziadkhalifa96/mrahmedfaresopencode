import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';

class Exam extends Model<InferAttributes<Exam>, InferCreationAttributes<Exam>> {
  declare id: CreationOptional<number>;
  declare courseId: ForeignKey<number>;
  declare title: string;
  declare titleAr: string;
  declare description: CreationOptional<string>;
  declare descriptionAr: CreationOptional<string>;
  declare duration: number;
  declare passingScore: number;
  declare maxAttempts: CreationOptional<number>;
  declare isPublished: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Exam.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    titleAr: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    descriptionAr: { type: DataTypes.TEXT, allowNull: true },
    duration: { type: DataTypes.INTEGER, allowNull: false, comment: 'minutes' },
    passingScore: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 50 },
    maxAttempts: { type: DataTypes.INTEGER, defaultValue: 3 },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'exams',
    modelName: 'Exam',
    timestamps: true,
    underscored: true,
  }
);

export default Exam;
