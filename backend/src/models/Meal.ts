import { Sequelize, DataTypes } from 'sequelize';

export const MealModel = async (sequelize: Sequelize) => {
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
  return Meal;
};
