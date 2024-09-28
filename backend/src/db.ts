import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: process.env.LOG_LEVEL === 'info', // enable logging when log level is set to 'info'
  // logging: false, // Enable detailed logging for debugging purposes
});
(async () => {
  db.sync({ force: true });
})();

export default db;
