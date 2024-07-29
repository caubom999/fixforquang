import * as express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/authmiddleware';
import { register, login, profile } from '../controllers/authcontroller';

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, profile);

export default router;
