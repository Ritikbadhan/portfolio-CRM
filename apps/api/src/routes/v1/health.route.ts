import { Router } from 'express';
import { successResponse } from '../../utils/response.util';

const router = Router();

router.get('/', (req, res) => {
  successResponse(res, 200, 'API is running', { version: 'v1' });
});

export default router;
