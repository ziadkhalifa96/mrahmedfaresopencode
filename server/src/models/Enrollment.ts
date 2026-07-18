import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';

class Enrollment extends Model<InferAttributes<Enrollment>, InferCreationAttributes<Enrollment>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<number>;
  declare courseId: ForeignKey<number>;
  declare status: CreationOptional<'active' | 'completed'>;
  declare enrolledAt: CreationOptional<Date>;
  declare completedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Enrollment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('active', 'completed'), defaultValue: 'active' },
    enrolledAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'enrollments',
    modelName: 'Enrollment',
    timestamps: true,
    underscored: true,
  }
);

export default Enrollment;
