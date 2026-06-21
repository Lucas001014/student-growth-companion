import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface HomeworkUploadAttributes {
  id: number;
  student_id: number;
  subject: string;
  image_url: string;
  description?: string;
  is_public?: number;
  teacher_note?: string;
  reviewed_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface HomeworkUploadCreationAttributes extends Optional<HomeworkUploadAttributes, 'id' | 'description' | 'is_public' | 'teacher_note' | 'reviewed_at' | 'created_at' | 'updated_at'> {}

class HomeworkUpload extends Model<HomeworkUploadAttributes, HomeworkUploadCreationAttributes> implements HomeworkUploadAttributes {
  public id!: number;
  public student_id!: number;
  public subject!: string;
  public image_url!: string;
  public description?: string;
  public is_public?: number;
  public teacher_note?: string;
  public reviewed_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

HomeworkUpload.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    subject: { type: DataTypes.STRING(50), allowNull: false },
    image_url: { type: DataTypes.STRING(500), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_public: { type: DataTypes.TINYINT, defaultValue: 0 },
    teacher_note: { type: DataTypes.TEXT, allowNull: true },
    reviewed_at: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: 'homework_uploads', modelName: 'HomeworkUpload', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default HomeworkUpload;
