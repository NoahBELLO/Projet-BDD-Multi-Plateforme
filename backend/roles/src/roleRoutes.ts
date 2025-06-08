import { Router } from 'express';
import RoleController from "./roleController";
const router: Router = Router();

const roleController: RoleController = new RoleController();

// GET
router.get('/', roleController.getAllRoles);
router.get('/id/:id', roleController.getRoleById);
router.get('/name/:name', roleController.getRoleByName);

// POST
router.post('/', roleController.createRole);

// PUT
router.put('/id/:id', roleController.updateRoleById);
router.put('/name/:name', roleController.updateRoleByName);

// DELETE
router.delete('/id/:id', roleController.deleteRoleById);
router.delete('/name/:name', roleController.deleteRoleByName);

export default router;