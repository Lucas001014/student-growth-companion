import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ClassAttributes {
  id: number;
  name: string;
  grade?: string;
  school_id?: number;
  created_at?: Date;
  updated_at?: Date;
}
interface ClassCreationAttributes extends Optional<ClassAttributes, 'id' | 'created_at' | 'updated_at'> {}

class ClassModel extends Model<ClassAttributes, ClassCreationAttributes> implements ClassAttributes {
  public id!: number;
  public name!: string;
  public grade?: string;
  public school_id?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ClassModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    grade: { type: DataTypes.STRING(20), allowNull: true },
    school_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: 'classes', modelName: 'Class' }
);

export default ClassModel;
