import express from 'express';
import multer from 'multer';
const router = express.Router();
import authController from '../controllers/authController';
import emailMiddleWare from '../middleware/Email.middleware';
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
const upload = multer({storage: multer.memoryStorage(), fileFilter})

// PUBLIC ROUTES//

router.post('/register', emailMiddleWare.checkEmail, authController.register);

router.post('/login', authController.login);

router.post('/social', emailMiddleWare.checkEmail, authController.socialSignIn);

router.post('/password', emailMiddleWare.checkEmail, authController.sendMail);

//PRIVATE ROUTES //

router.post('/', verifyToken.verifyTokenJWT, authController.verifyToken);

router.post('/token', authController.refreshToken);

router.patch('/profile/:userId', verifyToken.verifyTokenJWT, upload.single('avatar'), multerErrorMiddleware, authController.changeAvatar);

router.put('/profile/:userId', verifyToken.verifyTokenJWT, authController.changeProfile);

router.patch('/password/:email', verifyToken.verifyTokenMail, authController.reset);

export default router;
