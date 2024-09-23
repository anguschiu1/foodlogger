import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: process.env.LOG_LEVEL === 'info', // Disable all logging
});
(async () => {
  db.sync({ force: true });
})();

export default db;
