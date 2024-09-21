import { expect, test, vi } from 'vitest';
import supertest from 'supertest';
import app from './index';

test('GET /spec should return 200 status code', async () => {
  const response = await supertest(app).get('/spec');
  expect(response.status).toBe(200);
});
test('GET /foodlogs should return correct greeting message', async () => {
  const response = await supertest(app).get('/foodlogs/1');
  expect(response.status).toBe(200);
  expect(response.body).toEqual([
    {
      date: '12-31-2023',
      id: 1,
      meals: [
        {
          finished_at: '12-31-2023 10:00:00',
          food_consumed: [
            { name: 'White bread', weight: 100 },
            { name: 'Butter', weight: 8 },
          ],
          id: 0,
          image: '123.jpg',
          name: 'Breakfast',
        },
        {
          finished_at: '12-31-2023 13:30:00',
          food_consumed: [
            { name: 'Boiled potatoes', weight: 50 },
            { name: 'butter', weight: 15 },
          ],
          id: 0,
          image: '456.jpg',
          name: 'Lunch',
        },
      ],
      owner: { id: 1 },
    },
  ]);
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
    first_name: 'John',
    id: 1,
    last_name: 'Doe',
  });
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
