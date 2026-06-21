import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface RequestAttributes {
  id: number;
  type: 'skin_change' | 'title_change' | 'homework_confirm';
  student_id: number;
  target_skin_id?: number;
  target_title_id?: number;
  reason?: string;
  subject?: string;
  homework_description?: string;
  parent_remark?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'expired';
  reviewed_by?: number;
  review_remark?: string;
  reviewed_at?: Date;
  reward_points?: number;
  expires_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface RequestCreationAttributes extends Optional<RequestAttributes, 'id' | 'target_skin_id' | 'target_title_id' | 'reason' | 'subject' | 'homework_description' | 'parent_remark' | 'status' | 'reviewed_by' | 'review_remark' | 'reviewed_at' | 'reward_points' | 'expires_at' | 'created_at' | 'updated_at'> {}

class Request extends Model<RequestAttributes, RequestCreationAttributes> implements RequestAttributes {
  public id!: number;
  public type!: 'skin_change' | 'title_change' | 'homework_confirm';
  public student_id!: number;
  public target_skin_id?: number;
  public target_title_id?: number;
  public reason?: string;
  public subject?: string;
  public homework_description?: string;
  public parent_remark?: string;
  public status?: 'pending' | 'approved' | 'rejected' | 'expired';
  public reviewed_by?: number;
  public review_remark?: string;
  public reviewed_at?: Date;
  public reward_points?: number;
  public expires_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Request.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.ENUM('skin_change', 'title_change', 'homework_confirm'), allowNull: false },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    target_skin_id: { type: DataTypes.INTEGER, allowNull: true },
    target_title_id: { type: DataTypes.INTEGER, allowNull: true },
    reason: { type: DataTypes.TEXT, allowNull: true },
    subject: { type: DataTypes.STRING(50), allowNull: true },
    homework_description: { type: DataTypes.TEXT, allowNull: true },
    parent_remark: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected', 'expired'), defaultValue: 'pending' },
    reviewed_by: { type: DataTypes.INTEGER, allowNull: true },
    review_remark: { type: DataTypes.TEXT, allowNull: true },
    reviewed_at: { type: DataTypes.DATE, allowNull: true },
    reward_points: { type: DataTypes.INTEGER, defaultValue: 0 },
    expires_at: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: 'requests', modelName: 'Request', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default Request;
