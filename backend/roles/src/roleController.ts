import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { RoleModel } from './roleModel';

class RoleController {
    async getAllRoles(req: Request, res: Response): Promise<void> {
        try {
            let roles = await RoleModel.collection.find({}).toArray();
            if (!roles) {
                throw new Error("Liste des rôles non trouvée");
            }
            res.status(201).json(roles);
        }
        catch (err) {
            res.status(500).json({ message: "Aucun rôle trouvé" });
        }
    }

    async getRoleByName(req: Request, res: Response): Promise<void> {
        try {
            let { name } = req.params;
            if (!name) {
                throw new Error("Nom manquant");
            }

            let role = await RoleModel.collection.findOne({ name: name });
            if (!role) {
                throw new Error("Rôle non trouvé");
            }
            res.status(201).json(role);
        }
        catch (err) {
            res.status(500).json({ message: "Aucun rôle trouvé" });
        }
    }

    async getRoleById(req: Request, res: Response): Promise<void> {
        try {
            let { id } = req.params;
            if (!id) {
                throw new Error("ID manquant");
            }

            let role = await RoleModel.collection.findOne({ _id: new ObjectId(id) });
            if (!role) {
                throw new Error("Rôle non trouvé");
            }
            res.status(201).json(role);
        }
        catch (err) {
            res.status(500).json({ message: "Aucun rôle trouvé" });
        }
    }

    async createRole(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;
            if (!name) {
                throw new Error("Information manquant");
            }

            const existingRole = await RoleModel.collection.findOne({ name: name });
            if (existingRole) {
                res.status(400).json({ message: "Le rôle existe déjà" });
                return;
            }

            let role = await RoleModel.collection.insertOne({ name });
            if (!role) {
                throw new Error("Rôle non créé");
            }

            res.status(201).json({ message: "Rôle créé avec succès" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun rôle créé" });
        }
    }

    async updateRoleById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!id || !name) {
                throw new Error("Information manquant");
            }

            const result = await RoleModel.collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { name: name } }
            );

            if (result.modifiedCount === 0) {
                throw new Error("Aucun rôle mis à jour");
            }

            res.status(200).json({ message: "Rôle mis à jour avec succès" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun rôle mis à jour" });
        }
    }

    async updateRoleByName(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.params;
            const { newName } = req.body;

            if (!name || !newName) {
                throw new Error("Information manquant");
            }

            const result = await RoleModel.collection.updateOne(
                { name: name },
                { $set: { name: newName } }
            );

            if (result.modifiedCount === 0) {
                throw new Error("Aucun rôle mis à jour");
            }

            res.status(200).json({ message: "Rôle mis à jour avec succès" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun rôle mis à jour" });
        }
    }

    async deleteRoleById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                throw new Error("Information manquant");
            }

            const result = await RoleModel.collection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 0) {
                throw new Error("Aucun rôle supprimé");
            }

            res.status(200).json({ message: "Rôle supprimé avec succès" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun rôle supprimé" });
        }
    }

    async deleteRoleByName(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.params;
            if (!name) {
                throw new Error("Information manquant");
            }

            const result = await RoleModel.collection.deleteOne({ name: name });
            if (result.deletedCount === 0) {
                throw new Error("Aucun rôle supprimé");
            }

            res.status(200).json({ message: "Rôle supprimé avec succès" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun rôle supprimé" });
        }
    }

    async convertion(req: Request, res: Response): Promise<void> {
        try {
            const roles: string[] = req.body.roles;

            if (!Array.isArray(roles) || !roles) {
                res.status(400).json({ error: 'roleIds must be an array' });
                return;
            }

            const objectIds: ObjectId[] = roles.map(id => new ObjectId(id));
            if (!objectIds) {
                res.status(400).json({ error: 'roleIds must be an array' });
                return;
            }

            const rolesBDD = await RoleModel.collection.find({ _id: { $in: objectIds } }).project({ name: 1 }).toArray();
            if (!rolesBDD) {
                res.status(400).json({ error: 'roleIds must be an array' });
                return;
            }

            const nameRoles: string[] = rolesBDD.map(r => r.name);
            if (!nameRoles) {
                res.status(400).json({ error: 'roleIds must be an array' });
                return;
            }

            res.status(201).json({ nameRoles: nameRoles });
        }
        catch (err) {
            res.status(500).json({ error: 'Erreur serveur' });
            return
        }
    }
}
export default RoleController;