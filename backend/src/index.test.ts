import { expect, test } from 'vitest';
import supertest from 'supertest';
import app from './index';

test('GET / should return 200 status code', async () => {
  const response = await supertest(app).get('/');
  expect(response.status).toBe(200);
});
test('GET / should return correct greeting message', async () => {
  const response = await supertest(app).get('/');
  expect(response.body.message).toBe('Hello Express + TypeScript Server');
});
