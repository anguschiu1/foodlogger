// @ts-nocheck
import { expect, test, vi } from 'vitest';
import dotenv from 'dotenv';
import sequelize from './db';
import User from './models/User';
import bcrypt from 'bcrypt';

test('Test connection to the database', async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    expect((error as Error).message).toBe(
      'Unable to connect to the database: Connection refused'
    );
  }
});

test('Create a new user and can be read correctly', async () => {
  try {
    await sequelize.sync({ force: true });
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await User.create({
      email: 'testuser@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      city: 'New York',
    });
    const users = await User.findAll();
    expect(users.every((user) => user instanceof User)).toBeTruthy();
    expect(user.id).toBeGreaterThan(0);
    const foundUser = await User.findByPk(1);
    expect(foundUser).toBeTruthy();
    expect(foundUser.email).toEqual('testuser@example.com');
    expect(foundUser.firstName).toEqual('Test');
    expect(foundUser.lastName).toEqual('User');
    expect(foundUser.city).toEqual('New York');

    const isPasswordMatch = await bcrypt.compare(
      'password123',
      foundUser.password
    );
    expect(isPasswordMatch).toBeTruthy();

    await user.destroy();
  } catch (error) {
    expect((error as Error).message).toBe(
      'Validation error: User.email cannot be null'
    );
  }
});
