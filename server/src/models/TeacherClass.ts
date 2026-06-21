import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TeacherClassAttributes {
  id: number;
  teacher_id: number;
  class_id: number;
  created_at?: Date;
  updated_at?: Date;
}

interface TeacherClassCreationAttributes extends Optional<TeacherClassAttributes, 'id' | 'created_at' | 'updated_at'> {}

class TeacherClass extends Model<TeacherClassAttributes, TeacherClassCreationAttributes> implements TeacherClassAttributes {
  public id!: number;
  public teacher_id!: number;
  public class_id!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

TeacherClass.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    teacher_id: { type: DataTypes.INTEGER, allowNull: false, unique: 'teacher_class_unique' },
    class_id: { type: DataTypes.INTEGER, allowNull: false, unique: 'teacher_class_unique' },
  },
  { sequelize, tableName: 'teacher_classes', modelName: 'TeacherClass', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default TeacherClass;
