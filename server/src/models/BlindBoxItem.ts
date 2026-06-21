import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BlindBoxItemAttributes {
  id: number;
  blind_box_id: number;
  item_type: 'skin' | 'title' | 'points' | 'empty';
  item_id?: number;
  points_amount?: number;
  probability?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface BlindBoxItemCreationAttributes extends Optional<BlindBoxItemAttributes, 'id' | 'item_id' | 'points_amount' | 'probability' | 'created_at' | 'updated_at'> {}

class BlindBoxItem extends Model<BlindBoxItemAttributes, BlindBoxItemCreationAttributes> implements BlindBoxItemAttributes {
  public id!: number;
  public blind_box_id!: number;
  public item_type!: 'skin' | 'title' | 'points' | 'empty';
  public item_id?: number;
  public points_amount?: number;
  public probability?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

BlindBoxItem.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    blind_box_id: { type: DataTypes.INTEGER, allowNull: false },
    item_type: { type: DataTypes.ENUM('skin', 'title', 'points', 'empty'), allowNull: false },
    item_id: { type: DataTypes.INTEGER, allowNull: true },
    points_amount: { type: DataTypes.INTEGER, allowNull: true },
    probability: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  },
  { sequelize, tableName: 'blind_box_items', modelName: 'BlindBoxItem', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default BlindBoxItem;
