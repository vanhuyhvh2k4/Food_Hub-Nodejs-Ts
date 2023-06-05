import express from 'express';
import multer from 'multer';
const router = express.Router();
import authController from '../controllers/authController';
import authMiddleware from '../middleware/auth.middleware';
import verifyToken from '../middleware/verifyToken.middleware';
import multerErrorMiddleware from '../middleware/multerError.middleware';
import CheckEmailMiddleware from '../middleware/checkEmail.middleware';

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

router.post('/', verifyToken.verifyTokenJWT, authController.verifyToken);

router.post('/register', authMiddleware.checkEmail, authController.register);

router.post('/login', authController.login);

router.post('/social', CheckEmailMiddleware.checkEmailSocial, authController.socialSignIn);

router.post('/token', authController.refreshToken);

router.patch('/profile/:userId', verifyToken.verifyTokenJWT, upload.single('avatar'), multerErrorMiddleware, authController.changeAvatar);

router.put('/profile/:userId', verifyToken.verifyTokenJWT, authController.changeProfile);

router.post('/password', CheckEmailMiddleware.checkHasMail, authController.sendMail);

router.patch('/password/:email', verifyToken.verifyTokenMail, authController.reset);

export default router;
