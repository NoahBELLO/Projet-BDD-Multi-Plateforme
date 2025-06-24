import { Request, Response, NextFunction } from "express";
import Outils from "./authOutils";
import { ObjectId } from "mongodb";
import axios from 'axios';

function roleMiddleware(wantedRoles: string[]) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const tokenAccess: string = req.cookies.tokenAccess;
        if (!tokenAccess) {
            res.status(401).json({ message: "Token(s) manquant(s)" });
            return;
        }

        const deviceFingerprintTest: string = Outils.createDeviceFingerprint(req);

        const goodAccessToken = Outils.verifyAccessToken(tokenAccess, deviceFingerprintTest);
        if (!goodAccessToken) {
            res.status(401).json({ message: "AccessToken invalide ou expiré" });
            return;
        }

        const reponseUser = await axios.get(`${process.env.USER_URL}filtrer/id/${goodAccessToken.userId}`)
        if (!reponseUser || !reponseUser.data) {
            res.status(401).json({ message: "Utilisateur introuvable pour role" });
            return;
        }

        let roles: ObjectId[] = reponseUser.data.role;
        if (!roles || roles.length === 0) {
            res.status(403).json({ error: true, message: 'Pas de rôles associé' });
            return
        }

        try {
            const response = await axios.post(`${process.env.ROLE_URL}convertion`, { roles: roles });
            if (!response || !response.data) {
                res.status(401).json({ message: "Utilisateur introuvable pour role" });
                return;
            }

            const has = response.data.nameRoles.some((r: string) => wantedRoles.includes(r));
            if (!has) {
                res.status(403).json({ error: true, message: 'Rôle interdit' });
                return;
            }

            next();
        } catch (err) {
            res.status(500).json({ error: true, message: 'Erreur rôle' });
            return
        }
    };
}

export default roleMiddleware