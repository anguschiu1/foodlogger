import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import * as OpenApiValidator from 'express-openapi-validator';
import { submitImage, getIngredients } from './LogMealServices';
import { getFoodLogs, createFoodLogs, deleteFoodLogs } from './FoodLogServices';
import { getUsers, createUsers, updateUsers, loginUser } from './UserServices';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

import log from 'loglevel';
dotenv.config();

// Set up logging
log.setLevel((process.env.LOG_LEVEL as log.LogLevelDesc) || 'info');
log.info('Current log level:', log.getLevel());

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));

// POST /foodimages need to be implemented before OpenAPI validator is used to avoid bugs in the OpenAPI validator
app.post(
  '/foodimages/:meal_id',
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      const { meal_id } = req.params;
      if (!req.file) {
        res.status(400).json({ message: 'Bad Request' });
        return;
      }
      log.info('Received food image:', req.file);
      log.info('path:', req.file.path);
      const data = await submitImage(req.file.path);
      log.info('Food data:', data.imageId);
      const ingredients = await getIngredients(data.imageId);
      log.info('Ingredients:', ingredients);
      type Food = {
        mealId: string;
        name: string;
        weight: number;
      };
      type FoodImage = {
        food: Food[];
        imageId: number;
      };
      const allFood: Food[] = [];
      ingredients.foodName.forEach((foodName: string) => {
        log.info('Found foodName:', foodName);
        allFood.push({
          mealId: meal_id,
          name: foodName,
          weight: 0,
        });
      });
      const resBody = {
        food: allFood,
        image: req.file.path,
      };
      res.status(201).json(resBody);
    } catch (error) {
      log.error('Error processing food image:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// serve the Swagger/OpenAPI specification file (e.g. for Swagger UI or Postman)
const apiSpec = path.join(__dirname, 'api_v1.yaml');
app.use('/spec', express.static(apiSpec));

app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateResponses: true,
  })
);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Hello to foodlogger API',
  });
});
app.get('/users/:user_id', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    if (isNaN(parseInt(user_id))) {
      res.status(400).json({ message: 'Bad Request' });
      return;
    } else {
      const data = await getUsers(parseInt(user_id)); // it is Ok as user_id is validated as integer by OpenApiValidator middleware
      if (data) {
        const trimmedData = {
          city: data.city,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          id: data.id,
        };
        res.status(200).json(trimmedData);
      } else {
        res.status(404).json({ message: 'Not Found' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/users', async (req: Request, res: Response) => {
  try {
    log.info('Received user data:', req.body);
    const user = await createUsers(req.body);
    res.status(201).json({
      data: {
        city: user.city,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
      },
      status: 'success',
    });
  } catch (error) {
    console.error('Error creating user:', (error as Error).message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/users/login', async (req: Request, res: Response) => {
  try {
    log.info('Received user data:', req.body);
    const { user, status } = await loginUser(req.body);
    if (status === 200) {
      res.status(200).json({
        data: {
          city: user.city,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          id: user.id,
        },
        status: 'success',
      });
    } else if (status === 400) {
      res.status(400).json({ message: 'Bad Request' });
      return;
    } else if (status === 401) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
  } catch (error) {
    console.error('Error login user:', (error as Error).message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.patch('/users/:user_id', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    log.info('Received user_id:', user_id);
    const data = await updateUsers(parseInt(user_id), req.body);
    if (isNaN(parseInt(user_id))) {
      res.status(400).json({ message: 'Bad Request' });
      return;
    }
    log.info('Received user data:', req.body);
    if (data == null) {
      res.status(404).json({ message: 'Not Found' });
      return;
    } else {
      log.info('returned with status 204:', data);
      res.status(204).send();
      return;
    }
  } catch (error) {
    console.error('Error updating user:', (error as Error).message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/foodlogs/:user_id', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    log.info('Received user_id:', user_id);
    if (isNaN(parseInt(user_id))) {
      res.status(400).json({ message: 'Bad Request' });
      return;
    }
    const data = await getFoodLogs(parseInt(user_id)); // it is Ok as user_id is validated as integer by OpenApiValidator middleware
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'Not Found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/foodlogs/:user_id', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    log.info('Received user_id:', user_id);
    if (isNaN(parseInt(user_id))) {
      res.status(400).json({ message: 'Bad Request' });
      return;
    }
    log.info('Received foodlog data:', req.body);
    await createFoodLogs(parseInt(user_id), req.body);
    res.status(201).json({ status: 'success' });
  } catch (error) {
    console.error('Error creating user:', (error as Error).message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete(
  '/foodlogs/:user_id/:food_log_id',
  async (req: Request, res: Response) => {
    try {
      const { user_id, food_log_id } = req.params;
      log.info('Received user_id:', user_id);
      log.info('Received food_log_id:', food_log_id);
      if (isNaN(parseInt(user_id)) || isNaN(parseInt(food_log_id))) {
        res.status(400).json({ message: 'Bad Request' });
        return;
      }
      await deleteFoodLogs(parseInt(user_id), parseInt(food_log_id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting food log:', (error as Error).message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
