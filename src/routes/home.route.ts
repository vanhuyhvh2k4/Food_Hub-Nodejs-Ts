import express from 'express';

import homeController from '../controllers/homeController';
import verifyToken from '../middleware/verifyToken.middleware';

const router = express.Router();

router.get('/user', verifyToken.verifyTokenJWT, homeController.getUser);

router.get('/shop', verifyToken.verifyTokenJWT, homeController.getShop);

router.get('/food', verifyToken.verifyTokenJWT, homeController.getFood);

export default router;
