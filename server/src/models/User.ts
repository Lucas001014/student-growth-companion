import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
  id: number;
  phone: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'teacher';
  is_active: number;
  must_change_password?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'is_active' | 'created_at' | 'updated_at'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public phone!: string;
  public password_hash!: string;
  public name!: string;
  public role!: 'admin' | 'teacher';
  public is_active!: number;
  public must_change_password?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    phone: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    name: { type: DataTypes.STRING(50), allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'teacher'), allowNull: false, defaultValue: 'teacher' },
    is_active: { type: DataTypes.TINYINT, defaultValue: 1 },
    must_change_password: { type: DataTypes.TINYINT, defaultValue: 0 },
  },
  { sequelize, tableName: 'users', modelName: 'User' }
);

export default User;
