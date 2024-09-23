import { expect, test, vi } from 'vitest';
import supertest from 'supertest';
import app from './index';
import sequelize from './db';

test('GET /spec should return 200 status code', async () => {
  const response = await supertest(app).get('/spec');
  expect(response.status).toBe(200);
});
test('POST /users should create a new user and return the created user object', async () => {
  await sequelize.sync({ force: true });
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
test('POST /foodlogs should create a new foodlog and return foodlog object', async () => {
  const response = await supertest(app)
    .post('/foodlogs/1')
    .send({
      date: '2023-12-31',
      meals: [
        {
          finishedAt: '2023-12-31T10:00:00',
          name: 'Breakfast',
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
test('GET /foodlogs should return correct greeting message', async () => {
  const response = await supertest(app).get('/foodlogs/1');
  expect(response.status).toBe(200);
});

test('GET /foodlogs should return correct status code on non-numeric user id input', async () => {
  const response = await supertest(app).get('/foodlogs/john');
  expect(response.status).toBe(400);
});
test('GET /foodlogs should return correct status code if no user id is provided', async () => {
  const response = await supertest(app).get('/foodlogs');
  expect(response.status).toBe(404);
});

test('GET /users should return correct User object', async () => {
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
test('GET /users should return correct HTTP status code for no results returned', async () => {
  const response = await supertest(app).get('/users/1000');
  expect(response.status).toBe(404);
});
test('GET /users should return correct status code on non-numeric user id input', async () => {
  const response = await supertest(app).get('/users/john');
  expect(response.status).toBe(400);
});
test('GET /users should return correct status code if no user id is provided', async () => {
  const response = await supertest(app).get('/users');
  expect(response.status).toBe(405);
});

// Uncomment the following test to test the /recogniseFood endpoint with a valid image file
// test('GET /recogniseFood should return 200 status code with valid image file and food recognition results', async () => {
//   const response = await supertest(app).get('/recogniseFood');

//   expect(response.status).toBe(200);
//   expect(response.body).toEqual(
//     expect.objectContaining({
//       foodFamily: [
//         {
//           id: 8,
//           name: 'vegetables',
//           prob: 1.0,
//         },
//       ],
//     })
//   );
// });
