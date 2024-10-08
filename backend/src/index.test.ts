import { beforeAll, describe, expect, test, vi } from 'vitest';
import supertest from 'supertest';
import app from './index';
import sequelize from './db';
import fs from 'fs';
import path from 'path';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});
test('GET /spec should return 200 status code', async () => {
  const response = await supertest(app).get('/spec');
  expect(response.status).toBe(200);
});
describe('API Tests', () => {
  test('POST /users should create a new user, return HTTP 201 and User object', async () => {
    const response = await supertest(app).post('/users').send({
      email: 'john.doe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      city: 'Cambridge',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      data: {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        city: 'Cambridge',
        id: 1,
      },
      status: 'success',
    });
  });

  test('GET /users/1 should return correct User object', async () => {
    const response = await supertest(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      city: 'Cambridge',
      email: 'john.doe@example.com',
      firstName: 'John',
      id: 1,
      lastName: 'Doe',
    });
  });
  test('GET /users/1000 should return HTTP 404 for no results returned', async () => {
    const response = await supertest(app).get('/users/1000');
    expect(response.status).toBe(404);
  });
  test('GET /users/john should return HTTP 400 on non-numeric user id input', async () => {
    const response = await supertest(app).get('/users/john');
    expect(response.status).toBe(400);
  });
  test('GET /users should return HTTP 405 if no user id is provided', async () => {
    const response = await supertest(app).get('/users');
    expect(response.status).toBe(405);
  });
  test('POST /users/login should login user, return HTTP 200 and User object', async () => {
    const response = await supertest(app).post('/users/login').send({
      email: 'john.doe@example.com',
      password: 'password123',
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        city: 'Cambridge',
        id: 1,
      },
      status: 'success',
    });
  });
  test('POST /users/login should reject wrong email/password combination and return HTTP 401', async () => {
    const response = await supertest(app).post('/users/login').send({
      email: 'john.doe@example.com',
      password: 'WRONG_PASSWORD',
    });
    expect(response.status).toBe(401);
  });
  test('POST /users/login should reject wrong email/password combination and return HTTP 401', async () => {
    const response = await supertest(app).post('/users/login').send({
      email: 'wrong.email@example.com',
      password: 'password123',
    });
    expect(response.status).toBe(401);
  });
  test('POST /users/login should reject invalid input and return HTTP 400', async () => {
    const response = await supertest(app).post('/users/login').send({
      emailwrong: 'john.doe@example.com',
      passwordwrong: 'password123',
    });
    expect(response.status).toBe(400);
  });
  test('PATCH /users/1 should correctly modify user information and return HTTP 204', async () => {
    const response = await supertest(app).patch('/users/1').send({
      email: 'xjohn.doe@example.com',
      password: 'xpassword123',
      firstName: 'xJohn',
      lastName: 'xDoe',
      city: 'xCambridge',
      isActive: false,
    });
    expect(response.status).toBe(204);
  });

  test('GET /users/1 should return HTTP 200 and updated User object', async () => {
    const response = await supertest(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      city: 'xCambridge',
      email: 'xjohn.doe@example.com',
      firstName: 'xJohn',
      id: 1,
      lastName: 'xDoe',
    });
  });
  test('PATCH /users/1000 should return HTTP 404 if user_id is not found', async () => {
    const response = await supertest(app).patch('/users/100').send({
      email: 'xjohn.doe@example.com',
      password: 'xpassword123',
      firstName: 'xJohn',
      lastName: 'xDoe',
      city: 'xCambridge',
      isActive: false,
    });
    expect(response.status).toBe(404);
  });
  test('PATCH /users/1abc should return HTTP 400 if user_id is non-numeric', async () => {
    const response = await supertest(app).patch('/users/1abc').send({
      email: 'xjohn.doe@example.com',
      password: 'xpassword123',
      firstName: 'xJohn',
      lastName: 'xDoe',
      city: 'xCambridge',
      isActive: false,
    });
    expect(response.status).toBe(400);
  });

  // test('GET /users should return HTTP 404 for no results returned', async () => {
  //   const response = await supertest(app).get('/users/1000');
  //   expect(response.status).toBe(404);
  // });
  // test('GET /users should return HTTP 400 on non-numeric user id input', async () => {
  //   const response = await supertest(app).get('/users/john');
  //   expect(response.status).toBe(400);
  // });
  // test('GET /users should return HTTP 405 if no user id is provided', async () => {
  //   const response = await supertest(app).get('/users');
  //   expect(response.status).toBe(405);
  // });
  test('POST /foodlogs should create a new food log, return HTTP 201 and FoodLog object', async () => {
    const response = await supertest(app)
      .post('/foodlogs/1')
      .send({
        date: '2023-12-31',
        meals: [
          {
            finishedAt: '2023-12-31T10:00:00',
            name: 'Breakfast',
            image: 'uploads/1727540618373.jpg',
            foodConsumed: [
              {
                name: 'White bread',
                weight: 100,
              },
              {
                name: 'Butter',
                weight: 8,
              },
            ],
          },
          {
            finishedAt: '2023-12-31T13:30:00',
            name: 'Lunch',
            image: 'uploads/1727532588498.jpg',
            foodConsumed: [
              {
                name: 'Boiled potatoes',
                weight: 50,
              },
              {
                name: 'Butter',
                weight: 15,
              },
            ],
          },
        ],
      });
    expect(response.status).toBe(201);
  });
  test('GET /foodlogs/1 should return HTTP 200 and FoodLog object', async () => {
    const response = await supertest(app).get('/foodlogs/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        date: '2023-12-31',
        id: 1,
        UserId: 1,
        Meals: [
          expect.objectContaining({
            id: 1,
            name: 'Breakfast',
            finishedAt: expect.any(String),
            image: 'uploads/1727540618373.jpg',
            FoodLogId: 1,
            Food: [
              expect.objectContaining({
                id: 2,
                name: 'Butter',
                weight: 8,
                MealId: 1,
              }),
              expect.objectContaining({
                id: 1,
                name: 'White bread',
                weight: 100,
                MealId: 1,
              }),
            ],
          }),
          expect.objectContaining({
            id: 2,
            name: 'Lunch',
            finishedAt: expect.any(String),
            image: 'uploads/1727532588498.jpg',
            FoodLogId: 1,
            Food: [
              expect.objectContaining({
                id: 3,
                name: 'Boiled potatoes',
                weight: 50,
                MealId: 2,
              }),
              expect.objectContaining({
                id: 4,
                name: 'Butter',
                weight: 15,
                MealId: 2,
              }),
            ],
          }),
        ],
      }),
    ]);
  });
  test('GET /foodlogs/john should return HTTP 400 on non-numeric user id input', async () => {
    const response = await supertest(app).get('/foodlogs/john');
    expect(response.status).toBe(400);
  });
  test('GET /foodlogs should return HTTP 404 if no user id is provided', async () => {
    const response = await supertest(app).get('/foodlogs');
    expect(response.status).toBe(404);
  });
  test('DELETE /foodlogs/1/1 should delete the foodlog and return HTTP 204', async () => {
    const response = await supertest(app).delete('/foodlogs/1/1');
    expect(response.status).toBe(204);
  });
  test('GET /foodlogs/1 should return HTTP 404 as food log is deleted', async () => {
    const response = await supertest(app).get('/foodlogs/1');
    expect(response.status).toBe(404);
  });
});
// Uncomment the following test to test the /submitImage endpoint with a valid image file
test.skip('POST /submitImage should return 201 status code with valid image file and food recognition results', async () => {
  const filePath = path.resolve(__dirname, 'assets/1728299.jpg');

  if (fs.existsSync(filePath)) {
    console.log(`Testing image file: ${filePath}`);
  } else {
    console.error(`Image file not found: ${filePath}`);
    return;
  }
  const response = await supertest(app)
    .post('/submitImage')
    .attach('image', '../assets/1728299.jpg');

  console.log('Response:', response.body);
  expect(response.status).toBe(201);
  expect(response.body).toEqual(
    expect.objectContaining({
      food: [
        {
          mealId: '1',
          name: 'ketchup sauce',
          weight: 0,
        },
        {
          mealId: '1',
          name: 'ketchup sauce',
          weight: 0,
        },
        {
          mealId: '1',
          name: 'french fries',
          weight: 0,
        },
        {
          mealId: '1',
          name: 'mayonnaise',
          weight: 0,
        },
        {
          mealId: '1',
          name: 'french fries',
          weight: 0,
        },
      ],
      image: 'uploads/1727549746356.jpg',
    })
  );
});
