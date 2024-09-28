// @ts-nocheck
import { beforeAll, expect, test, vi } from 'vitest';
import dotenv from 'dotenv';
import sequelize from './db';
import User from './models/User';
import bcrypt from 'bcrypt';
beforeAll(async () => {
  await sequelize.sync({ force: true });
});
test('Test connection to the database', async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    expect((error as Error).message).toBe(
      'Unable to connect to the database: Connection refused'
    );
  }
});
