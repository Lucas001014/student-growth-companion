import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface StudentIdentityAttributes {
  id: number;
  student_id: number;
  badge_id: number;
  created_at?: Date;
  updated_at?: Date;
}

interface StudentIdentityCreationAttributes extends Optional<StudentIdentityAttributes, 'id' | 'created_at' | 'updated_at'> {}

class StudentIdentity extends Model<StudentIdentityAttributes, StudentIdentityCreationAttributes> implements StudentIdentityAttributes {
  public id!: number;
  public student_id!: number;
  public badge_id!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

StudentIdentity.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false, unique: 'student_badge_unique' },
    badge_id: { type: DataTypes.INTEGER, allowNull: false, unique: 'student_badge_unique' },
  },
  { sequelize, tableName: 'student_identities', modelName: 'StudentIdentity', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default StudentIdentity;
