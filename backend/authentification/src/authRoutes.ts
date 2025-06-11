import { Router } from 'express';
import AuthController from "./authController";
const router: Router = Router();
import authMiddleware from './authMiddleware';

const authController: AuthController = new AuthController();
router.get("/check", authMiddleware, (req, res) => {
    if (req.auth) {
        res.json({ loggedIn: true, userId: req.auth.userId });
    } else {
        res.json({ loggedIn: false });
    }
});

// GET
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);

// POST
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

export default router;