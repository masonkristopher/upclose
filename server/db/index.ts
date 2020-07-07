// setup database in here
import { Sequelize } from 'sequelize';

require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'uc';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const { DB_INSTANCE, NODE_ENV } = process.env;

let sequelize;

if (NODE_ENV === 'production') {
  // production (cloud sql) database connection
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: `/cloudsql/${process.env.DB_INSTANCE}`,
    dialect: 'mysql',
    logging: false, // toggle logging SQL in console
    dialectOptions: {
      socketPath: `/cloudsql/${DB_INSTANCE}`,
    },
  });
} else {
  // development (local) database connection
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // toggle logging SQL in console
  });
}

// sequelize.sync(); // will not drop tables every time

export default sequelize;
