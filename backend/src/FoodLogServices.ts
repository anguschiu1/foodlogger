import sequelize from './db';
import FoodLog from './models/FoodLog';
import Meal from './models/Meal';
import Food from './models/Food';
import log from 'loglevel';

export const getFoodLogs = async (user_id: number) => {
  log.info('Getting food logs for user_id: ', user_id);
  try {
    const foodLogs = await FoodLog.findAll({
      where: { userId: user_id },
      include: [
        {
          model: Meal,
          include: [
            {
              model: Food,
            },
          ],
        },
      ],
    });
    if (foodLogs === null || foodLogs.length === 0) {
      log.info('food logs not found in the database. User_id: ', user_id);
      return null;
    } else {
      log.info('food logs found in the database');
      log.info(foodLogs);
      return foodLogs;
    }
  } catch (error) {
    console.error('Error getting food logs:', (error as Error).message);
  }
};

export const createFoodLogs = async (user_id: number, foodLogData: any) => {
  log.info('Creating new food log in the database');
  log.info(foodLogData);
  log.info(foodLogData.meals);
  if (!user_id || !foodLogData.date || !foodLogData.meals) {
    log.info('Missing required data to create foodlogs.');
    throw new Error('Missing required data to create foodlogs.');
  }
  const foodLog = await FoodLog.create({
    date: foodLogData.date,
    UserId: user_id,
  });
  // log.info('FoodLog.toJSON before creating meals inside');
  // log.info(foodLog.toJSON());
  if (foodLogData.meals) {
    const createdMeals = await Promise.all(
      foodLogData.meals.map(async (meal: any) => {
        const meal_db = await Meal.create({
          finishedAt: meal.finishedAt,
          name: meal.name,
          image: meal.image,
          FoodLogId: foodLog.toJSON().id,
        });
        if (meal.foodConsumed) {
          const createFoods = await Promise.all(
            meal.foodConsumed.map(async (food: any) => {
              const food_db = await Food.create({
                name: food.name,
                weight: food.weight,
                MealId: meal_db.toJSON().id,
              });
            })
          );
        }
      })
    );
  }
  log.info('FoodLog created successfully');
  log.info(foodLog.toJSON());
  return foodLog.toJSON();
};

export const deleteFoodLogs = async (user_id: number, foodLog_id: number) => {
  log.info('Deleting food log in the database');
  log.info('user_id:', user_id);
  log.info('foodLog_id:', foodLog_id);
  try {
    const foodLog = await FoodLog.findByPk(foodLog_id);
    if (foodLog === null) {
      log.info('Food log not found in the database. foodLog_id: ', foodLog_id);
      return null;
    }
    await foodLog.destroy();
    log.info('Food log deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting food log:', (error as Error).message);
  }
};
