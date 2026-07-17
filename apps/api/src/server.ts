import app from './app';
import { connectDatabase } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

startServer();
