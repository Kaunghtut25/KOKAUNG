import { Router, Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json(new ApiResponse(200, 'A9 Global Travels & Tours API is running', {
    timestamp: new Date().toISOString(),
  }));
});

export default router;
