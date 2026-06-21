import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface StudentAttributes {
  id: number;
  student_no: string;
  name: string;
  class_id: number;
  avatar?: string;
  points?: number;
  parent_password: string;
  class_verify_code?: string;
  is_deleted?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface StudentCreationAttributes extends Optional<StudentAttributes, 'id' | 'avatar' | 'points' | 'class_verify_code' | 'is_deleted' | 'created_at' | 'updated_at'> {}

class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  public id!: number;
  public student_no!: string;
  public name!: string;
  public class_id!: number;
  public avatar?: string;
  public points?: number;
  public parent_password!: string;
  public class_verify_code?: string;
  public is_deleted?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Student.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_no: { type: DataTypes.STRING(30), unique: true, allowNull: false },
    name: { type: DataTypes.STRING(50), allowNull: false },
    class_id: { type: DataTypes.INTEGER, allowNull: false },
    avatar: { type: DataTypes.STRING(500), defaultValue: '/default_avatar.png' },
    points: { type: DataTypes.INTEGER, defaultValue: 0 },
    parent_password: { type: DataTypes.STRING(255), allowNull: false },
    class_verify_code: { type: DataTypes.STRING(10), allowNull: true },
    is_deleted: { type: DataTypes.TINYINT, defaultValue: 0 },
  },
  { sequelize, tableName: 'students', modelName: 'Student', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default Student;
