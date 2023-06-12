import express from 'express';
import multer from 'multer';
const router = express.Router();
import FoodController from '../controllers/foodController';
import verifyToken from '../middleware/verifyToken.middleware';
import multerErrorMiddleware from '../middleware/multerError.middleware';

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
        cb(null, true);
    } else {
        const error: any = new Error('Only JPG, PNG, and WebP files are allowed');
        error.status = 400; // Set the error status code
        cb(error)
    }
}

const upload = multer({storage: multer.memoryStorage(), fileFilter});

//PUBLIC ROUTES

//PRIVATE ROUTES

router.get("/", verifyToken.verifyTokenJWT, FoodController.getListFood);

router.get('/like', verifyToken.verifyTokenJWT, FoodController.getLikedFoods);

router.get("/:foodId", FoodController.getFoodInfo);

router.patch('/like/:foodId', verifyToken.verifyTokenJWT, FoodController.changeLike);

router.post('/', verifyToken.verifyTokenJWT, upload.single('image'), multerErrorMiddleware, FoodController.createNewFood);

export default router;

