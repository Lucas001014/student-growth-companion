import { Sequelize } from 'sequelize';
import config from './index';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: config.mysql.host,
  port: config.mysql.port,
  username: config.mysql.username,
  password: config.mysql.password,
  database: config.mysql.database,
  timezone: '+08:00',
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
export { Sequelize };
