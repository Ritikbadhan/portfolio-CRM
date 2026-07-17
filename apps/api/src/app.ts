import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Placeholder for routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;
