import { expect, test, vi } from 'vitest';
import supertest from 'supertest';
import app from './index';

test('GET / should return 200 status code', async () => {
  const response = await supertest(app).get('/');
  expect(response.status).toBe(200);
});
test('GET / should return correct greeting message', async () => {
  const response = await supertest(app).get('/');
  expect(response.body.message).toBe('Hello to foodlogger API');
});
test('GET /getUserProfileInfo should return correct user id and company id', async () => {
  const response = await supertest(app).get('/getUserProfileInfo');
  expect(response.status).toBe(200);
  expect(response.body).toEqual(
    expect.objectContaining({ company_id: 21704, user_id: 21705 })
  );
});
