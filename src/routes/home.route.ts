import express from 'express';

import homeController from '../controllers/homeController';
import verifyToken from '../middleware/verifyToken.middleware';

const router = express.Router();

//PRIVATE ROUTES

router.get('/user', verifyToken.verifyTokenJWT, homeController.getUser);

router.get('/shop', verifyToken.verifyTokenJWT, homeController.getShop);

export default router;
