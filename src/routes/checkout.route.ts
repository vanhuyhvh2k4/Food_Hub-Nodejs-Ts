import express from 'express';
const router = express.Router();
import verifyToken from '../middleware/verifyToken.middleware';
import checkoutController from '../controllers/checkoutController';
import checkStatusOfOrder from '../middleware/checkStatusOrder.middleware';

router.post('/cart', verifyToken.verifyTokenJWT, checkoutController.addCart);

router.get('/number', verifyToken.verifyTokenJWT, checkoutController.getNumber);

router.get('/cart', verifyToken.verifyTokenJWT, checkoutController.getCart);

router.delete('/cart/:cartId', verifyToken.verifyTokenJWT, checkoutController.deleteCart);

router.get('/bill', verifyToken.verifyTokenJWT, checkoutController.getBill);

router.post('/order', verifyToken.verifyTokenJWT, checkoutController.order);

router.get('/order', verifyToken.verifyTokenJWT, checkoutController.myOrder);

router.delete('/order/:orderId', verifyToken.verifyTokenJWT, checkStatusOfOrder.isBought, checkoutController.cancel);

router.get('/order/history', verifyToken.verifyTokenJWT, checkoutController.getOrderHistory);

router.get('/order/detail/:orderId', verifyToken.verifyTokenJWT, checkoutController.getOrderDetail);

export default router;
