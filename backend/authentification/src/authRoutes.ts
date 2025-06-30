import { Router } from 'express';
import AuthController from "./authController";
const router: Router = Router();
import authMiddleware from './authMiddleware';
import roleMiddleware from './roleMiddleware';

const authController: AuthController = new AuthController();
// MIDDLEWARE
router.get("/check", authMiddleware, roleMiddleware(["client"]), (req, res) => {
    if (req.auth) {
        res.json({ loggedIn: true, userId: req.auth.userId });
    } else {
        res.json({ loggedIn: false });
    }
});

// GET
router.get('/health', (req, res) => { res.status(200).send('OK'); });
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);

// POST
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;