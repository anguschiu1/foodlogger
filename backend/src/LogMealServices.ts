import axios from 'axios';
import { FormData } from 'formdata-node';
import { fileFromPath } from 'formdata-node/file-from-path';
import fs from 'node:fs';
import dotenv from 'dotenv';

export const recogniseFood = async (imagePath: fs.PathLike) => {
  dotenv.config();
  const formData = new FormData();
  formData.set('image', await fileFromPath(imagePath.toString()));

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.LOG_MEAL_API}/v2/image/segmentation/complete/v1.0?language=eng`,
    headers: {
      Authorization: `Bearer ${process.env.LOG_MEAL_BEARER_TOKEN}`,
    },
    data: formData,
  };
  return (await axios.request(config)).data;
};
