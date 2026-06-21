import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface StudentSkinAttributes {
  id: number;
  student_id: number;
  skin_id: number;
  is_equipped?: number;
  source?: string;
  granted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface StudentSkinCreationAttributes extends Optional<StudentSkinAttributes, 'id' | 'is_equipped' | 'source' | 'granted_at' | 'created_at' | 'updated_at'> {}

class StudentSkin extends Model<StudentSkinAttributes, StudentSkinCreationAttributes> implements StudentSkinAttributes {
  public id!: number;
  public student_id!: number;
  public skin_id!: number;
  public is_equipped?: number;
  public source?: string;
  public granted_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

StudentSkin.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    skin_id: { type: DataTypes.INTEGER, allowNull: false },
    is_equipped: { type: DataTypes.TINYINT, defaultValue: 0 },
    source: { type: DataTypes.STRING(50), allowNull: true },
    granted_at: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: 'student_skins', modelName: 'StudentSkin', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default StudentSkin;
