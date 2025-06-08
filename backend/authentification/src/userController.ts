import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Outils from './outils';
import crypto from 'crypto';
import { UserModel } from './userModel';
import { TokenModel } from './tokenModel';

// Interface pour la création de l'utilisateur
interface UtilisateurCréation {
    nom: string; prenom: string;
    adresseMail: string; grainDeSel: string;
    role: string;
}

interface UtilisateurModifier {
    mdpHasher: string;
}

interface PayloadAccess {
    userId: ObjectId; role: string;
    issuedAt: number; expiresIn: number;
    nonce: number; proofOfWork: string;
    scope: string[]; issuer: string;
    deviceFingerprint: string;
}

interface PayloadRefresh {
    userId: ObjectId;
    issuedAt: number;
    expiresIn: number;
    deviceFingerprint: string;
}

interface Tokens {
    tokenAccess: string;
    tokenRefresh: string;
}

class UserController {
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            let users = await UserModel.collection.find({}).toArray();
            if (!users) {
                throw new Error("Liste utilisateur non trouvée");
            }
            res.status(201).json(users);
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur trouver" });
        }
    }

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            let { adresseMail } = req.params;
            if (!adresseMail) {
                throw new Error("Email manquant");
            }

            let user = await UserModel.collection.findOne({ adresseMail: adresseMail });
            if (!user) {
                throw new Error("Utilisateur non trouvée");
            }
            res.status(201).json(user);
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur trouver" });
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { nom, prenom, adresseMail, role } = req.body;
            if (!nom || !prenom || !adresseMail || !role) {
                throw new Error("Information manquant");
            }

            let nombreCaractererAleatoire: number = Math.floor(Math.random() * 20) + 1;
            const grainDeSel: string = Outils.createGrainDeSel(nombreCaractererAleatoire);
            if (!grainDeSel) {
                throw new Error("Erreur lors de la création du grain de sel");
            }

            let newUtilisateur: UtilisateurCréation = { nom, prenom, adresseMail, grainDeSel, role };
            if (!newUtilisateur) {
                throw new Error("Information manquant");
            }

            let user = await UserModel.collection.insertOne(newUtilisateur);
            if (!user) {
                throw new Error("Utilisateur non crée");
            }

            res.status(201).json({ grainDeSel: grainDeSel });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur crée" });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            // Récupérer le mot de passe hasher en FrontEnd
            const { adresseMail, grainDeSel, motDePasse, /* mdpHasher */ } = req.body;
            if (!adresseMail || !grainDeSel || !motDePasse) {
                throw new Error("Information manquant");
            }

            // Hasher le mot de passe en FrontEnd
            const mdpHasher = crypto.createHash('sha256').update(motDePasse + grainDeSel).digest('hex');
            if (!mdpHasher) {
                throw new Error("Erreur lors de la création du hash du mot de passe");
            }

            let updateUtilisateur: UtilisateurModifier = { mdpHasher };
            if (!updateUtilisateur) {
                throw new Error("Information manquant");
            }

            const result = await UserModel.collection.updateOne(
                { adresseMail: adresseMail },
                { $set: updateUtilisateur }
            );
            if (result.modifiedCount === 0) {
                throw new Error("Aucun utilisateur mis à jour");
            }

            const { issuedAt, deviceFingerprint } = Outils.createData(req);
            if (!issuedAt || !deviceFingerprint) {
                throw new Error("Erreur lors de la création des données de token");
            }

            const expiresInAccess: number = Outils.createExpiresIn();
            if (!expiresInAccess) {
                throw new Error("Erreur lors de la création de l'expiration de l'accès");
            }

            const user = await UserModel.collection.findOne({ adresseMail: adresseMail });
            if (!user) {
                throw new Error("Utilisateur non trouvée");
            }

            const data: string = `${user._id}${user.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
            const { nonce, proofOfWork } = Outils.createNonce(data);
            if (!nonce || !proofOfWork) {
                throw new Error("Erreur lors de la création des données de nonce et proofOfWork");
            }

            const payloadAccess: PayloadAccess = {
                userId: user._id, role: user.role,
                issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
                scope: ['read', 'write'], issuer: "authServer",
                deviceFingerprint
            }

            const tokenAccess: string = Outils.generateToken(payloadAccess);
            if (!tokenAccess) {
                throw new Error("Erreur lors de la création du token");
            }

            const expiresInRefresh: number = Outils.createExpiresIn(false);
            if (!expiresInRefresh) {
                throw new Error("Erreur lors de la création de l'expiration du rafraichissement");
            }

            const payloadRefresh: PayloadRefresh = {
                userId: user._id,
                issuedAt,
                expiresIn: expiresInRefresh,
                deviceFingerprint
            };

            const tokenRefresh: string = Outils.generateToken(payloadRefresh);
            if (!tokenRefresh) {
                throw new Error("Erreur lors de la création du token");
            }

            const tokenObjet: Tokens = { tokenAccess: `Bearer ${tokenAccess}`, tokenRefresh }
            if (!tokenObjet) {
                throw new Error("Erreur lors de la création du token dans la base de données");
            }

            const tokenExisteBDD = await TokenModel.collection.findOne({ userId: user._id });
            if (!tokenExisteBDD) {
                let tokenBDD = await TokenModel.collection.insertOne(
                    { userId: user._id, ...tokenObjet }
                );
                if (!tokenBDD) {
                    throw new Error("Aucun token créer");
                }
            }
            else {
                let tokenBDD = await TokenModel.collection.updateOne(
                    { userId: user._id },
                    { $set: tokenObjet }
                );
                if (!tokenBDD.modifiedCount) {
                    throw new Error("Aucun token mis à jour");
                }
            }

            res.cookie("tokenAccess", `Bearer ${tokenAccess}`/* , { httpOnly: false, secure: false, sameSite: "strict" } */);
            res.cookie("tokenRefresh", tokenRefresh/* , { httpOnly: false, secure: false, sameSite: "strict" } */);
            res.status(201).json({ message: "Utilisateur mis à jour" });
        }
        catch (err) {
            res.status(500).json({ message: "Aucun utilisateur mis à jour" });
        }
    }

    async deleteUser() { }

    async login(req: Request, res: Response): Promise<void> {
        try {
            // Récupérer le mot de passe hasher en FrontEnd
            let { adresseMail, motDePasse, /* mdpHasher */ } = req.body;
            if (!adresseMail /* || !mdpHasher */ || !motDePasse) {
                throw new Error("Information manquant");
            }

            const user = await UserModel.collection.findOne({ adresseMail: adresseMail });
            if (!user) {
                throw new Error("Utilisateur non trouvée");
            }

            // Hasher le mot de passe en FrontEnd
            // const mdpHasher = crypto.createHash('sha256').update(motDePasse + user.grainDeSel).digest('hex');
            // if (!mdpHasher) {
            //     throw new Error("Erreur lors de la création du hash du mot de passe");
            // }

            const compareMdpHasher = crypto.createHash('sha256').update(motDePasse + user.grainDeSel).digest('hex');
            if (compareMdpHasher !== user.mdpHasher) {
                throw new Error("Mauvais mot de passe");
            }

            const { issuedAt, deviceFingerprint } = Outils.createData(req);
            if (!issuedAt || !deviceFingerprint) {
                throw new Error("Erreur lors de la création des données de token");
            }

            const expiresInAccess: number = Outils.createExpiresIn();
            if (!expiresInAccess) {
                throw new Error("Erreur lors de la création de l'expiration de l'accès");
            }

            const data: string = `${user._id}${user.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
            const { nonce, proofOfWork } = Outils.createNonce(data);
            if (!nonce || !proofOfWork) {
                throw new Error("Erreur lors de la création des données de nonce et proofOfWork");
            }

            const payloadAccess: PayloadAccess = {
                userId: user._id, role: user.role,
                issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
                scope: ['read', 'write'], issuer: "authServer",
                deviceFingerprint
            }

            const tokenAccess: string = Outils.generateToken(payloadAccess);
            if (!tokenAccess) {
                throw new Error("Erreur lors de la création du token");
            }

            const expiresInRefresh: number = Outils.createExpiresIn(false);
            if (!expiresInRefresh) {
                throw new Error("Erreur lors de la création de l'expiration du rafraichissement");
            }

            const payloadRefresh: PayloadRefresh = {
                userId: user._id,
                issuedAt,
                expiresIn: expiresInRefresh,
                deviceFingerprint
            };
            const tokenRefresh: string = Outils.generateToken(payloadRefresh);
            if (!tokenRefresh) {
                throw new Error("Erreur lors de la création du token");
            }

            const tokenObjet: Tokens = { tokenAccess: `Bearer ${tokenAccess}`, tokenRefresh }
            if (!tokenObjet) {
                throw new Error("Erreur lors de la création du token dans la base de données");
            }

            const tokenExisteBDD = await TokenModel.collection.findOne({ userId: user._id });
            if (!tokenExisteBDD) {
                let tokenBDD = await TokenModel.collection.insertOne(
                    { userId: user._id, ...tokenObjet }
                );
                if (!tokenBDD) {
                    throw new Error("Aucun token créer");
                }
            }
            else {
                let tokenBDD = await TokenModel.collection.updateOne(
                    { userId: user._id },
                    { $set: tokenObjet }
                );
                if (!tokenBDD.modifiedCount) {
                    throw new Error("Aucun token mis à jour");
                }
            }

            res.cookie("tokenAccess", `Bearer ${tokenAccess}`);
            res.cookie("tokenRefresh", tokenRefresh);
            res.status(201).json({ message: "Utilisateur connectée" });
        }
        catch (err) {
            res.status(500).json({ message: "Utilisateur non connectée" });
        }
    }
}
export default UserController;