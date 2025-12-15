import express from 'express';
import eventRoutes from './events.js';
import userRoutes from './users.js';

const router = express.Router();

/* Health check / root API */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running'
  });
});

router.use('/users', userRoutes);
router.use('/events', eventRoutes);

export default router;
