import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';

class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<number>;
  declare courseId: CreationOptional<ForeignKey<number>>;
  declare bookingId: CreationOptional<ForeignKey<number>>;
  declare amount: number;
  declare currency: CreationOptional<string>;
  declare method: 'vodafone_cash' | 'instapay';
  declare proofImage: string;
  declare senderPhone: string;
  declare status: CreationOptional<'pending' | 'approved' | 'rejected'>;
  declare adminNotes: CreationOptional<string>;
  declare reviewedAt: CreationOptional<Date>;
  declare reviewedBy: CreationOptional<ForeignKey<number>>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Payment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    courseId: { type: DataTypes.INTEGER, allowNull: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), defaultValue: 'EGP' },
    method: { type: DataTypes.ENUM('vodafone_cash', 'instapay'), allowNull: false },
    proofImage: { type: DataTypes.STRING(500), allowNull: false },
    senderPhone: { type: DataTypes.STRING(20), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
    adminNotes: { type: DataTypes.TEXT, allowNull: true },
    reviewedAt: { type: DataTypes.DATE, allowNull: true },
    reviewedBy: { type: DataTypes.INTEGER, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'payments',
    modelName: 'Payment',
    timestamps: true,
    underscored: true,
  }
);

export default Payment;
