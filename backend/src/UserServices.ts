import sequelize from './db';
import User from './models/User';
import bcrypt from 'bcrypt';

export const getUsers = async (user_id: number) => {
  const user = await User.findByPk(user_id);
  if (user === null) {
    console.log('user not found in the database. User_id: ', user_id);
    return null;
  } else return user.toJSON();
};

export const createUsers = async (userData: any) => {
  console.log('Creating new user in the database');
  console.log(userData);
  if (
    !userData.email ||
    !userData.password ||
    !userData.firstName ||
    !userData.lastName ||
    !userData.city
  ) {
    console.log('Missing required user data');
    throw new Error('Missing required user data');
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await User.create({
    email: userData.email,
    password: hashedPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
    city: userData.city,
  });
  console.log('User created successfully');
  console.log(user.toJSON());
  return user.toJSON();
};
