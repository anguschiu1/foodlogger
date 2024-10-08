import { DataTypes } from 'sequelize';
import sequelize from '../db';
import User from './User';

const FoodLog = sequelize.define(
  'FoodLog',
  {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    // Other model options go here
  }
);

User.hasMany(FoodLog);
FoodLog.belongsTo(User);
export default FoodLog;
