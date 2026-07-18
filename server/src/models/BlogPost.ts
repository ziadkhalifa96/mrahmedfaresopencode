import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';

class BlogPost extends Model<InferAttributes<BlogPost>, InferCreationAttributes<BlogPost>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare titleAr: string;
  declare slug: string;
  declare content: string;
  declare contentAr: string;
  declare thumbnail: CreationOptional<string>;
  declare excerpt: CreationOptional<string>;
  declare excerptAr: CreationOptional<string>;
  declare isPublished: CreationOptional<boolean>;
  declare authorId: ForeignKey<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

BlogPost.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    titleAr: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    content: { type: DataTypes.TEXT('long'), allowNull: false },
    contentAr: { type: DataTypes.TEXT('long'), allowNull: false },
    thumbnail: { type: DataTypes.STRING(500), allowNull: true },
    excerpt: { type: DataTypes.TEXT, allowNull: true },
    excerptAr: { type: DataTypes.TEXT, allowNull: true },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'blog_posts',
    modelName: 'BlogPost',
    timestamps: true,
    underscored: true,
  }
);

export default BlogPost;
