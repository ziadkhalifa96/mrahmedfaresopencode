import { DataTypes, Model, CreationOptional } from 'sequelize';
import sequelize from '../config/database';

class HeroSlide extends Model {
  declare id: CreationOptional<number>;
  declare titleEn: string;
  declare titleAr: string;
  declare subtitleEn: string;
  declare subtitleAr: string;
  declare ctaTextEn: string;
  declare ctaTextAr: string;
  declare ctaLink: string;
  declare bgGradient: string;
  declare imageUrl: CreationOptional<string | null>;
  declare orderIndex: number;
  declare isActive: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

HeroSlide.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titleEn: { type: DataTypes.STRING(200), allowNull: false, field: 'title_en' },
  titleAr: { type: DataTypes.STRING(200), allowNull: false, field: 'title_ar' },
  subtitleEn: { type: DataTypes.TEXT, allowNull: false, field: 'subtitle_en' },
  subtitleAr: { type: DataTypes.TEXT, allowNull: false, field: 'subtitle_ar' },
  ctaTextEn: { type: DataTypes.STRING(100), allowNull: false, field: 'cta_text_en' },
  ctaTextAr: { type: DataTypes.STRING(100), allowNull: false, field: 'cta_text_ar' },
  ctaLink: { type: DataTypes.STRING(200), allowNull: false, defaultValue: '/courses', field: 'cta_link' },
  bgGradient: { type: DataTypes.STRING(200), allowNull: false, defaultValue: 'from-primary via-primary-dark to-blue-900', field: 'bg_gradient' },
  imageUrl: { type: DataTypes.STRING(500), allowNull: true, field: 'image_url' },
  orderIndex: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'order_index' },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
}, {
  sequelize,
  tableName: 'hero_slides',
  modelName: 'HeroSlide',
  timestamps: true,
  underscored: true,
});

export default HeroSlide;
