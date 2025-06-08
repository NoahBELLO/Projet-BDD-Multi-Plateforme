import { Router } from 'express';
import UserController from "./userController";
const router: Router = Router();

const userController: UserController = new UserController();
router.get("/bonjour", (req, res) => {
    console.log(req.auth);
    res.send("Bonjour");
});
router.get('/', userController.getAllUsers);
router.get('/:adresseMail', userController.getUser);
router.post('/inscription', userController.createUser);
router.put('/updateUser', userController.updateUser);
// router.delete('/deleteUser/:id', userController.deleteUser);
router.post('/login', userController.login);

export default router;