import express from 'express';
import ratingController from '../controllers/ratingController';

const router = express.Router();

router.get('/review/:foodId', ratingController.getReview);

export default router;