import mongoose from 'mongoose';
import { logger } from './logger';
import { env } from './env';

const MAX_RETRIES = 5;
let currentRetry = 0;

export const connectDatabase = async () => {
  try {
    const uri = env.MONGODB_URI;

    await mongoose.connect(uri);
    logger.info('✅ Successfully connected to MongoDB');
  } catch (error) {
    logger.error('❌ Error connecting to MongoDB:', error);
    currentRetry++;

    if (currentRetry < MAX_RETRIES) {
      logger.info(`Retrying connection... (${currentRetry}/${MAX_RETRIES})`);
      setTimeout(connectDatabase, 5000);
    } else {
      logger.error('Max retries reached. Exiting...');
      process.exit(1);
    }
  }
};

// Graceful Shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});
