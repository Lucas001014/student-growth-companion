import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TitleAttributes {
  id: number;
  name: string;
  icon: string;
  category?: 'study' | 'behavior' | 'moral' | 'special' | 'blindbox';
  description?: string;
  is_active?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface TitleCreationAttributes extends Optional<TitleAttributes, 'id' | 'category' | 'description' | 'is_active' | 'created_at' | 'updated_at'> {}

class Title extends Model<TitleAttributes, TitleCreationAttributes> implements TitleAttributes {
  public id!: number;
  public name!: string;
  public icon!: string;
  public category?: 'study' | 'behavior' | 'moral' | 'special' | 'blindbox';
  public description?: string;
  public is_active?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Title.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    icon: { type: DataTypes.STRING(500), allowNull: false },
    category: { type: DataTypes.ENUM('study', 'behavior', 'moral', 'special', 'blindbox'), defaultValue: 'study' },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_active: { type: DataTypes.TINYINT, defaultValue: 1 },
  },
  { sequelize, tableName: 'titles', modelName: 'Title', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default Title;
