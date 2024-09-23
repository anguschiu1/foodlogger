import { Sequelize } from 'sequelize';
import FoodLog from './models/FoodLog';
import Meal from './models/Meal';
import Food from './models/Food';
import User from './models/User';

const db = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  // logging: false, // Disable all logging
});
(async () => {
  db.sync({ force: true });
})();

export default db;
