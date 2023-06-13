import express from 'express';
const router = express.Router();
import searchController from '../controllers/searchController';
import verifyToken from '../middleware/verifyToken.middleware';

router.get('/', searchController.search);

router.get('/result', verifyToken.verifyTokenJWT, searchController.result);

export default router;
