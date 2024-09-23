import sequelize from './db';
import FoodLog from './models/FoodLog';
import Meal from './models/Meal';
import Food from './models/Food';

export const getFoodLogs = async (user_id: number) => {
  console.log('Getting food logs for user_id: ', user_id);
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
      console.log('food logs not found in the database. User_id: ', user_id);
      return null;
    } else {
      console.log('food logs found in the database');
      console.log(foodLogs);
      return foodLogs;
    }
  } catch (error) {
    console.error('Error getting food logs:', (error as Error).message);
  }
};

export const createFoodLogs = async (user_id: number, foodLogData: any) => {
  console.log('Creating new food log in the database');
  console.log(foodLogData);
  console.log(foodLogData.meals);
  const meals = foodLogData.meals.map((meal: any) => ({
    finishedAt: meal.finishedAt,
    name: meal.name,
    foodConsumed: meal.foodConsumed.map((food: any) => ({
      name: food.name,
      weight: food.weight,
    })),
  }));
  if (!user_id || !foodLogData.date || !foodLogData.meals) {
    console.log('Missing required data to create foodlogs.');
    throw new Error('Missing required data to create foodlogs.');
  }
  const foodLog = await FoodLog.create({
    date: foodLogData.date,
    UserId: user_id,
  });
  // console.log('FoodLog.toJSON before creating meals inside');
  // console.log(foodLog.toJSON());
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
  console.log('FoodLog created successfully');
  console.log(foodLog.toJSON());
  return foodLog.toJSON();
};
