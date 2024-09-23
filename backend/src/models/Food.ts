import { DataTypes } from 'sequelize';
import sequelize from '../db';
import Meal from './Meal';

const Food = sequelize.define('Food', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Meal.hasMany(Food);
Food.belongsTo(Meal);
export default Food;
