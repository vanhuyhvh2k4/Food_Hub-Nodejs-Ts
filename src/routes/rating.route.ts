import express from 'express';
import ratingController from '../controllers/ratingController';
import verifyToken from '../middleware/verifyToken.middleware';
import checkStatusOfOrder from '../middleware/checkStatusOrder.middleware';

const router = express.Router();

router.get('/review/:foodId', ratingController.getReview);

router.post('/review/:orderId', verifyToken.verifyTokenJWT, checkStatusOfOrder.isFinished, ratingController.review);

export default router;