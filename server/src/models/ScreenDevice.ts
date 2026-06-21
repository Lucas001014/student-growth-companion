import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ScreenDeviceAttributes {
  id: number;
  device_code: string;
  name: string;
  class_id?: number;
  is_online?: number;
  display_modules?: object;
  switch_interval?: number;
  schedule?: object;
  last_sync_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface ScreenDeviceCreationAttributes extends Optional<ScreenDeviceAttributes, 'id' | 'class_id' | 'is_online' | 'display_modules' | 'switch_interval' | 'schedule' | 'last_sync_at' | 'created_at' | 'updated_at'> {}

class ScreenDevice extends Model<ScreenDeviceAttributes, ScreenDeviceCreationAttributes> implements ScreenDeviceAttributes {
  public id!: number;
  public device_code!: string;
  public name!: string;
  public class_id?: number;
  public is_online?: number;
  public display_modules?: object;
  public switch_interval?: number;
  public schedule?: object;
  public last_sync_at?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ScreenDevice.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    device_code: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    class_id: { type: DataTypes.INTEGER, allowNull: true },
    is_online: { type: DataTypes.TINYINT, defaultValue: 0 },
    display_modules: { type: DataTypes.JSON, allowNull: true },
    switch_interval: { type: DataTypes.INTEGER, defaultValue: 20 },
    schedule: { type: DataTypes.JSON, allowNull: true },
    last_sync_at: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: 'screen_devices', modelName: 'ScreenDevice', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

export default ScreenDevice;
