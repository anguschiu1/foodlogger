import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `${process.env.LOG_MEAL_API}/v2/profile/getUserProfileInfo`,
  headers: {
    Authorization: `Bearer ${process.env.LOG_MEAL_BEARER_TOKEN}`,
  },
};

export const getUserProfileInfo = async () => {
  return (await axios.request(config)).data;
};
