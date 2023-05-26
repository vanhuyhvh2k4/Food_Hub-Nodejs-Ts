import express from 'express';
const router = express.Router();
import multer from 'multer';
import multerErrorMiddleware from '../middleware/multerError.middleware';
import ShopController from '../controllers/shopController';
import verifyToken from '../middleware/verifyToken.middleware'

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
        cb(null, true);
    } else {
        const error: any = new Error('Only JPG, PNG, and WebP files are allowed');
        error.status = 400; // Set the error status code
        cb(error)
    }
}

const upload = multer({storage: multer.memoryStorage(), fileFilter})

router.get('/info', ShopController.getInfo);

router.get('/food', verifyToken.verifyTokenJWT, ShopController.getFood);

router.post('/checkShopName', verifyToken.verifyTokenJWT, ShopController.checkShopName);

router.post('/shop', verifyToken.verifyTokenJWT, upload.fields([{ name: 'avatar', maxCount: 1}, { name: 'background', maxCount: 1}]), multerErrorMiddleware, ShopController.create);

router.patch('/like/:shopId', verifyToken.verifyTokenJWT, ShopController.changeLike);

router.get('/checkHasShop', verifyToken.verifyTokenJWT, ShopController.checkHasShop);

router.get('/favorite', verifyToken.verifyTokenJWT, ShopController.getFavoriteShop);

export default router;
