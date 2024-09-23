import { DataTypes } from 'sequelize';
import sequelize from '../db';
import FoodLog from './FoodLog';

const Meal = sequelize.define(
  'Meal',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    finishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    // Other model options go here
  }
);

FoodLog.hasMany(Meal);
Meal.belongsTo(FoodLog);
export default Meal;
