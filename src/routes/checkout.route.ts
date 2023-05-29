import express from 'express';
const router = express.Router();
import verifyToken from '../middleware/verifyToken.middleware';
import CheckoutController from '../controllers/checkoutController';
import checkStatusOfOrder from '../middleware/checkStatusOrder.middleware';

router.post('/cart', verifyToken.verifyTokenJWT, CheckoutController.addCart);

router.get('/number', verifyToken.verifyTokenJWT, CheckoutController.getNumber);

router.get('/cart', verifyToken.verifyTokenJWT, CheckoutController.getCart);

router.delete('/cart/:cartId', verifyToken.verifyTokenJWT, CheckoutController.deleteCart);

router.get('/bill', verifyToken.verifyTokenJWT, CheckoutController.getBill);

router.post('/order', verifyToken.verifyTokenJWT, CheckoutController.order);

router.get('/order', verifyToken.verifyTokenJWT, CheckoutController.myOrder);

router.delete('/order/:orderId', verifyToken.verifyTokenJWT, checkStatusOfOrder.isBought, CheckoutController.cancel);

router.get('/order/history', verifyToken.verifyTokenJWT, CheckoutController.getOrderHistory);

router.get('/order/detail/:orderId', verifyToken.verifyTokenJWT, CheckoutController.getOrderDetail);

export default router;
