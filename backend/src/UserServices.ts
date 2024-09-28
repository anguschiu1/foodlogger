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

export const loginUser = async (userData: any) => {
  log.info('Logging in user');
  log.info(userData);
  if (!userData.email || !userData.password) {
    log.info('Missing required login data');
    return { user: null, status: 400 };
  }

  const user: any = await User.findOne({ where: { email: userData.email } });
  if (user === null) {
    log.info('User not found in the database. Email: ', userData.email);
    return { user: null, status: 401 };
  }
  const isMatch = await bcrypt.compare(userData.password, user.password);
  if (!isMatch) {
    log.info('Invalid password for user. Email: ', userData.email);
    return { user: null, status: 401 };
  }
  return { status: 200, user: user.toJSON() };
};

export const updateUsers = async (user_id: number, userData: any) => {
  log.info('Updating user in the database');
  log.info(userData);
  if (!user_id) {
    log.info('Missing required user_id');
    throw new Error('Missing required user data');
  }
  const user = await User.findByPk(user_id);
  if (user === null) {
    log.info('User not found in the database. User_id: ', user_id);
    return null;
  }
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  await user.update(
    Object.keys(userData).reduce((acc: { [key: string]: string }, key) => {
      if (
        [
          'email',
          'firstName',
          'lastName',
          'city',
          'password',
          'isActive',
        ].includes(key)
      ) {
        acc[key] = userData[key];
      }
      return acc;
    }, {})
  );
  log.info('User updated successfully');
  log.info(user.toJSON());
  return user.toJSON();
};
