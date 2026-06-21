import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BlindBoxDrawAttributes {
  id: number;
  blind_box_id: number;
  student_id: number;
  item_id?: number;
  result_type?: string;
  result_skin_id?: number;
  result_title_id?: number;
  result_points?: number;
  cost_points: number;
  created_at?: Date;
  updated_at?: Date;
}

interface BlindBoxDrawCreationAttributes extends Optional<BlindBoxDrawAttributes, 'id' | 'item_id' | 'result_type' | 'result_skin_id' | 'result_title_id' | 'result_points' | 'created_at' | 'updated_at'> {}

class BlindBoxDraw extends Model<BlindBoxDrawAttributes, BlindBoxDrawCreationAttributes> implements BlindBoxDrawAttributes {
  public id!: number;
  public blind_box_id!: number;
  public student_id!: number;
  public item_id?: number;
  public result_type?: string;
  public result_skin_id?: number;
  public result_title_id?: number;
  public result_points?: number;
  public cost_points!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

BlindBoxDraw.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    blind_box_id: { type: DataTypes.INTEGER, allowNull: false },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    item_id: { type: DataTypes.INTEGER, allowNull: true },
    result_type: { type: DataTypes.STRING(50), allowNull: true },
    result_skin_id: { type: DataTypes.INTEGER, allowNull: true },
    result_title_id: { type: DataTypes.INTEGER, allowNull: true },
    result_points: { type: DataTypes.INTEGER, allowNull: true },
    cost_points: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: 'blind_box_draws', modelName: 'BlindBoxDraw', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default BlindBoxDraw;
