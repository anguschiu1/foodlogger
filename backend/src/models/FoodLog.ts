import { Sequelize, DataTypes } from 'sequelize';

export const FoodLogModel = async (sequelize: Sequelize) => {
  const FoodLog = sequelize.define(
    'FoodLog',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      // Other model options go here
    }
  );
  return FoodLog;
};
