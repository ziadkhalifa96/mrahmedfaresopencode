import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';

class Certificate extends Model<InferAttributes<Certificate>, InferCreationAttributes<Certificate>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<number>;
  declare courseId: ForeignKey<number>;
  declare certificateNumber: string;
  declare issuedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Certificate.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    certificateNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    issuedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'certificates',
    modelName: 'Certificate',
    timestamps: true,
    underscored: true,
  }
);

export default Certificate;
