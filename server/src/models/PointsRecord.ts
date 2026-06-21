import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PointsRecordAttributes {
  id: number;
  student_id: number;
  amount: number;
  balance_after: number;
  source: 'teacher_grant' | 'homework_confirm' | 'blindbox' | 'exchange';
  category?: string;
  remark?: string;
  operator_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface PointsRecordCreationAttributes extends Optional<PointsRecordAttributes, 'id' | 'category' | 'remark' | 'operator_id' | 'created_at' | 'updated_at'> {}

class PointsRecord extends Model<PointsRecordAttributes, PointsRecordCreationAttributes> implements PointsRecordAttributes {
  public id!: number;
  public student_id!: number;
  public amount!: number;
  public balance_after!: number;
  public source!: 'teacher_grant' | 'homework_confirm' | 'blindbox' | 'exchange';
  public category?: string;
  public remark?: string;
  public operator_id?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

PointsRecord.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    balance_after: { type: DataTypes.INTEGER, allowNull: false },
    source: { type: DataTypes.ENUM('teacher_grant', 'homework_confirm', 'blindbox', 'exchange'), allowNull: false },
    category: { type: DataTypes.STRING(50), allowNull: true },
    remark: { type: DataTypes.TEXT, allowNull: true },
    operator_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: 'points_records', modelName: 'PointsRecord', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default PointsRecord;
