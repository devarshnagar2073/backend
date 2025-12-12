import express from 'express';
import eventRoutes from './events.js';
import userRoutes from './users.js';
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/users', userRoutes);
router.use('/events', eventRoutes);


export default router;