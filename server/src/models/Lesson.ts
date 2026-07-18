import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';

class Lesson extends Model<InferAttributes<Lesson>, InferCreationAttributes<Lesson>> {
  declare id: CreationOptional<number>;
  declare chapterId: ForeignKey<number>;
  declare title: string;
  declare titleAr: string;
  declare type: CreationOptional<'video' | 'text' | 'quiz' | 'exam'>;
  declare content: CreationOptional<string>;
  declare contentAr: CreationOptional<string>;
  declare videoUrl: CreationOptional<string>;
  declare duration: CreationOptional<number>;
  declare orderIndex: CreationOptional<number>;
  declare isFree: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Lesson.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chapterId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    titleAr: { type: DataTypes.STRING(255), allowNull: false },
    type: { type: DataTypes.ENUM('video', 'text', 'quiz', 'exam'), defaultValue: 'text' },
    content: { type: DataTypes.TEXT('long'), allowNull: true },
    contentAr: { type: DataTypes.TEXT('long'), allowNull: true },
    videoUrl: { type: DataTypes.STRING(500), allowNull: true },
    duration: { type: DataTypes.INTEGER, defaultValue: 0 },
    orderIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
    isFree: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'lessons',
    modelName: 'Lesson',
    timestamps: true,
    underscored: true,
  }
);

export default Lesson;
