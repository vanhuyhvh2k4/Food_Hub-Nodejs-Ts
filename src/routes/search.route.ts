import express from 'express';
const router = express.Router();
import SearchController from '../controllers/searchController';
import verifyToken from '../middleware/verifyToken.middleware';

router.get('/', SearchController.search);

router.get('/result', verifyToken.verifyTokenJWT, SearchController.result);

export default router;
