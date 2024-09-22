import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import * as OpenApiValidator from 'express-openapi-validator';
import { recogniseFood } from './LogMealServices';
import { getFoodLogs } from './FoodLogServices';
import { getUsers } from './UserServices';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

// serve the Swagger/OpenAPI specification file
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
    const data = await getUsers(parseInt(user_id)); // it is Ok as user_id is validated as integer by OpenApiValidator middleware
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Remote server response: ${(error as Error).message}` });
  }
});

app.get('/foodlogs/:user_id', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const data = await getFoodLogs(parseInt(user_id)); // it is Ok as user_id is validated as integer by OpenApiValidator middleware
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Remote server response: ${(error as Error).message}` });
  }
});

app.get('/recogniseFood', async (_req: Request, res: Response) => {
  try {
    const imagePath = 'src/assets/1724193.jpg';
    const data = await recogniseFood(imagePath);
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Remote server response: ${(error as Error).message}` });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
// import Sequelize from 'sequelize';
import sequelize from './db';
import User from './models/User';

// sequelize.sync({ alter: true });
// sequelize.sync({ force: true });

// async function createUser() {
//   try {
//     await sequelize.sync({ force: true }); //drop existing tables and re-creates them
//     const user = await User.create({
//       email: 'testuser@efxample.com',
//       password: 'password123',
//       firstName: 'Test',
//       lastName: 'User',
//       city: 'New York',
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }

// createUser();
