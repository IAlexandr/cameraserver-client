import { Router } from 'express';

const router = Router();

router.get('/api/frames', (req, res) => {
  return res.json({ test: 'ok' });
});

export default router;