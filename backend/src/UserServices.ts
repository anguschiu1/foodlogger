import User from './models/User';
import bcrypt from 'bcrypt';
import log from 'loglevel';

export const getUsers = async (user_id: number) => {
  const user = await User.findByPk(user_id);
  if (user === null) {
    log.info('user not found in the database. User_id: ', user_id);
    return null;
  } else return user.toJSON();
};

export const createUsers = async (userData: any) => {
  log.info('Creating new user in the database');
  log.info(userData);
  if (
    !userData.email ||
    !userData.password ||
    !userData.firstName ||
    !userData.lastName ||
    !userData.city
  ) {
    log.info('Missing required user data');
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
  log.info('User created successfully');
  log.info(user.toJSON());
  return user.toJSON();
};
