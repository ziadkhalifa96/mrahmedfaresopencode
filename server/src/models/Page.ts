import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/database';

class Page extends Model<InferAttributes<Page>, InferCreationAttributes<Page>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare titleAr: string;
  declare slug: string;
  declare sections: CreationOptional<object>;
  declare seoTitle: CreationOptional<string>;
  declare seoTitleAr: CreationOptional<string>;
  declare seoDescription: CreationOptional<string>;
  declare seoDescriptionAr: CreationOptional<string>;
  declare isPublished: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Page.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    titleAr: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    sections: { type: DataTypes.JSON, allowNull: true },
    seoTitle: { type: DataTypes.STRING(255), allowNull: true },
    seoTitleAr: { type: DataTypes.STRING(255), allowNull: true },
    seoDescription: { type: DataTypes.TEXT, allowNull: true },
    seoDescriptionAr: { type: DataTypes.TEXT, allowNull: true },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'pages',
    modelName: 'Page',
    timestamps: true,
    underscored: true,
  }
);

export default Page;
