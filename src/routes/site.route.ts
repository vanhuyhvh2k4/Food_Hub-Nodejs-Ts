import express from 'express';
const router = express.Router();
import siteController from '../controllers/siteController';
import verifyToken from '../middleware/verifyToken.middleware';

router.get('/food', siteController.searchForFood);

router.get('/food/result', verifyToken.verifyTokenJWT, siteController.getFoodResult);

export default router;