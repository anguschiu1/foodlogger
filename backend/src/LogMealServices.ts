import axios from 'axios';
import { FormData } from 'formdata-node';
import { fileFromPath } from 'formdata-node/file-from-path';
import fs from 'node:fs';
import dotenv from 'dotenv';

export const submitImage = async (imagePath: fs.PathLike) => {
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

export const getIngredients = async (imageId: string) => {
  dotenv.config();
  const config = {
    method: 'post',
    url: `${process.env.LOG_MEAL_API}/v2/recipe/ingredients/v1.0?language=eng`,
    headers: {
      Authorization: `Bearer ${process.env.LOG_MEAL_BEARER_TOKEN}`,
    },
    data: { imageId: imageId },
  };

  console.log('Ingredients request:', config);
  return (await axios.request(config)).data;
};
