import express from 'express';
import { bookEvent, createEvent, deleteEvent, getEvents } from '../controller/eventController.js';
import { verifyToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', verifyToken, upload.single('primaryImage'), createEvent); 
router.delete('/:id', verifyToken, deleteEvent);

router.post('/:id/book', verifyToken, bookEvent);

export default router;