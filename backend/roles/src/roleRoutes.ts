import { Router } from 'express';
import RoleController from "./roleController";
const router: Router = Router();

const roleController: RoleController = new RoleController();

// GET
router.get('/health', (req, res) => { res.status(200).send('OK'); });
router.get('/', roleController.getAllRoles);
router.get('/id/:id', roleController.getRoleById);
router.get('/name/:name', roleController.getRoleByName);

// POST
router.post('/', roleController.createRole);
router.post('/convertion', roleController.convertion)

// PUT
router.put('/id/:id', roleController.updateRoleById);
router.put('/name/:name', roleController.updateRoleByName);

// DELETE
router.delete('/id/:id', roleController.deleteRoleById);
router.delete('/name/:name', roleController.deleteRoleByName);

export default router;