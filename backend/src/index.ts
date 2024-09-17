import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getUserProfileInfo } from './getUserProfileInfo';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Hello Express + TypeScript Server',
  });
});

app.get('/getUserProfileInfo', async (_req: Request, res: Response) => {
  try {
    const data = await getUserProfileInfo();
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Remote server response: ${(error as Error).message}` });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
