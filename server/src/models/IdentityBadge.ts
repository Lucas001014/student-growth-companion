import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface IdentityBadgeAttributes {
  id: number;
  name: string;
  icon: string;
  color: string;
  description?: string;
  is_active?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface IdentityBadgeCreationAttributes extends Optional<IdentityBadgeAttributes, 'id' | 'description' | 'is_active' | 'created_at' | 'updated_at'> {}

class IdentityBadge extends Model<IdentityBadgeAttributes, IdentityBadgeCreationAttributes> implements IdentityBadgeAttributes {
  public id!: number;
  public name!: string;
  public icon!: string;
  public color!: string;
  public description?: string;
  public is_active?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

IdentityBadge.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    icon: { type: DataTypes.STRING(500), allowNull: false },
    color: { type: DataTypes.STRING(20), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_active: { type: DataTypes.TINYINT, defaultValue: 1 },
  },
  { sequelize, tableName: 'identity_badges', modelName: 'IdentityBadge', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default IdentityBadge;
