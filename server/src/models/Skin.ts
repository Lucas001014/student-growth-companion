import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SkinAttributes {
  id: number;
  name: string;
  image_url: string;
  rarity?: 'N' | 'R' | 'SR' | 'SSR';
  description?: string;
  is_active?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface SkinCreationAttributes extends Optional<SkinAttributes, 'id' | 'rarity' | 'description' | 'is_active' | 'created_at' | 'updated_at'> {}

class Skin extends Model<SkinAttributes, SkinCreationAttributes> implements SkinAttributes {
  public id!: number;
  public name!: string;
  public image_url!: string;
  public rarity?: 'N' | 'R' | 'SR' | 'SSR';
  public description?: string;
  public is_active?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Skin.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    image_url: { type: DataTypes.STRING(500), allowNull: false },
    rarity: { type: DataTypes.ENUM('N', 'R', 'SR', 'SSR'), defaultValue: 'N' },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_active: { type: DataTypes.TINYINT, defaultValue: 1 },
  },
  { sequelize, tableName: 'skins', modelName: 'Skin', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default Skin;
