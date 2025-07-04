import { Router } from 'express';
import Controller from "./controllers";
const router: Router = Router();
const controller: Controller = new Controller();

router.get('/health', (req, res) => { res.status(200).send('OK'); });
router.get('/', controller.getRecommandation);
router.post('/', controller.getRecommandationComplexe);

export default router;