import express from 'express';
const router = express.Router();
import multer from 'multer';
import multerErrorMiddleware from '../middleware/multerError.middleware';
import shopController from '../controllers/shopController';
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

router.patch('/like/:shopId', verifyToken.verifyTokenJWT, shopController.changeLike);

router.post('/checkShopName', verifyToken.verifyTokenJWT, shopController.checkShopName);

router.get('/checkHasShop', verifyToken.verifyTokenJWT, shopController.checkHasShop);

router.get('/like', verifyToken.verifyTokenJWT, shopController.getFavoriteShop);

router.get('/:shopId', shopController.getShopInfo);

router.get("/", verifyToken.verifyTokenJWT, shopController.getListShop);

router.post('/', verifyToken.verifyTokenJWT, upload.fields([{ name: 'avatar', maxCount: 1}, { name: 'background', maxCount: 1}]), multerErrorMiddleware, shopController.createShop);

export default router;
