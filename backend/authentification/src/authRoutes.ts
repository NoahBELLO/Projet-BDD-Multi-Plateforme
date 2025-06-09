import { Router } from 'express';
import AuthController from "./authController";
const router: Router = Router();

const authController: AuthController = new AuthController();
router.get("/bonjour", (req, res) => {
    console.log(req.auth);
    res.send("Bonjour");
});

// GET
router.get('/google', authController.googleAuth);
// router.get('/google/callback', authController.googleAuthCallback);
router.get('/facebook', authController.facebookAuth);
// router.get('/facebook/callback', authController.facebookAuthCallback);

// POST
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

export default router;