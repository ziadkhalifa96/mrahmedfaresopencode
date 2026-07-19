import { DataTypes, Model, CreationOptional } from 'sequelize';
import sequelize from '../config/database';

class PageContent extends Model {
  declare id: CreationOptional<number>;
  declare page: string;
  declare section: string;
  declare key: string;
  declare valueEn: string;
  declare valueAr: string;
  declare metadata: CreationOptional<object | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PageContent.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  page: { type: DataTypes.STRING(50), allowNull: false },
  section: { type: DataTypes.STRING(50), allowNull: false },
  key: { type: DataTypes.STRING(100), allowNull: false },
  valueEn: { type: DataTypes.TEXT, allowNull: false },
  valueAr: { type: DataTypes.TEXT, allowNull: false },
  metadata: { type: DataTypes.JSON, allowNull: true },
}, {
  sequelize,
  tableName: 'page_content',
  modelName: 'PageContent',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['page', 'section', 'key'] }
  ]
});

export default PageContent;
