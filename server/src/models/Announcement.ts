import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AnnouncementAttributes {
  id: number;
  class_id?: number;
  title: string;
  content: string;
  target_type?: 'all' | 'specific_students';
  created_by?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface AnnouncementCreationAttributes extends Optional<AnnouncementAttributes, 'id' | 'class_id' | 'target_type' | 'created_by' | 'created_at' | 'updated_at'> {}

class Announcement extends Model<AnnouncementAttributes, AnnouncementCreationAttributes> implements AnnouncementAttributes {
  public id!: number;
  public class_id?: number;
  public title!: string;
  public content!: string;
  public target_type?: 'all' | 'specific_students';
  public created_by?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Announcement.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    class_id: { type: DataTypes.INTEGER, allowNull: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    target_type: { type: DataTypes.ENUM('all', 'specific_students'), defaultValue: 'all' },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: 'announcements', modelName: 'Announcement', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default Announcement;
