import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BlindBoxAttributes {
  id: number;
  name: string;
  description?: string;
  cost_points: number;
  daily_limit?: number;
  weekly_limit?: number;
  class_id?: number;
  is_active?: number;
  created_by?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface BlindBoxCreationAttributes extends Optional<BlindBoxAttributes, 'id' | 'description' | 'daily_limit' | 'weekly_limit' | 'class_id' | 'is_active' | 'created_by' | 'created_at' | 'updated_at'> {}

class BlindBox extends Model<BlindBoxAttributes, BlindBoxCreationAttributes> implements BlindBoxAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public cost_points!: number;
  public daily_limit?: number;
  public weekly_limit?: number;
  public class_id?: number;
  public is_active?: number;
  public created_by?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

BlindBox.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    cost_points: { type: DataTypes.INTEGER, allowNull: false },
    daily_limit: { type: DataTypes.INTEGER, allowNull: true },
    weekly_limit: { type: DataTypes.INTEGER, allowNull: true },
    class_id: { type: DataTypes.INTEGER, allowNull: true },
    is_active: { type: DataTypes.TINYINT, defaultValue: 1 },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: 'blind_boxes', modelName: 'BlindBox', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default BlindBox;
