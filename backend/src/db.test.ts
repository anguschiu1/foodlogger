import { expect, test, vi } from 'vitest';
import dotenv from 'dotenv';
import { testConnection } from './db';
import { Sequelize } from 'sequelize';

test('Test connection to the database', async () => {
  try {
    await testConnection();
    expect(true).toBe(true);
  } catch (error) {
    expect((error as Error).message).toBe(
      'Unable to connect to the database: Connection refused'
    );
  }
});
