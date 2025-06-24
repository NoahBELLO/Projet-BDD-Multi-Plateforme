import { Request, Response, NextFunction } from "express";
import Outils from "./authOutils";
import { ObjectId } from "mongodb";
import { TokenModel } from "./tokenModel";
import axios from "axios";

interface PayloadAccess {
    userId: ObjectId; role: string;
    issuedAt: number; expiresIn: number;
    nonce: number; proofOfWork: string;
    scope: string[]; issuer: string;
    deviceFingerprint: string;
}

export interface ReqAuth {
    userId: number;
}

declare module 'express-serve-static-core' {
    interface Request {
        auth: ReqAuth | null;
    }
}

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { tokenAccess, tokenRefresh }: Record<string, string> = req.cookies;
    req.auth = null;

    if (!tokenAccess || !tokenRefresh) {
        res.status(401).json({ message: "Token(s) manquant(s)" });
        return;
    }

    const deviceFingerprintTest: string = Outils.createDeviceFingerprint(req);

    // changer la partie verif pour intergrer la generation accesstoken avec refreshtoken
    let goodAccessToken = Outils.verifyAccessToken(tokenAccess, deviceFingerprintTest);
    if (!goodAccessToken) {
        const goodRefreshToken = Outils.verifyRefreshToken(tokenRefresh, deviceFingerprintTest);
        if (!goodRefreshToken) {
            res.status(401).json({ message: "RefreshToken invalide ou expiré" });
            return;
        }

        let response = await axios.get(`${process.env.USER_URL}filtrer/id/${goodRefreshToken.userId}`);
        if (!response || !response.data) {
            res.status(401).json({ message: "Utilisateur introuvable pour refresh" });
            return;
        }

        const { issuedAt, deviceFingerprint } = Outils.createData(req);
        if (!issuedAt || !deviceFingerprint) {
            throw new Error("Erreur lors de la création des données de token");
        }

        const expiresInAccess: number = Outils.createExpiresIn();
        if (!expiresInAccess) {
            throw new Error("Erreur lors de la création de l'expiration de l'accès");
        }

        const data: string = `${response.data._id}${response.data.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
        const { nonce, proofOfWork } = Outils.createNonce(data);
        if (!nonce || !proofOfWork) {
            throw new Error("Erreur lors de la création des données de nonce et proofOfWork");
        }

        const payloadAccess: PayloadAccess = {
            userId: new ObjectId(response.data._id), role: response.data.role,
            issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
            scope: ['read', 'write'], issuer: "authServer",
            deviceFingerprint
        }

        const newTokenAccess: string = Outils.generateToken(payloadAccess);
        if (!newTokenAccess) {
            throw new Error("Erreur lors de la création du token");
        }

        const tokenExisteBDD = await TokenModel.collection.updateOne(
            { userId: new ObjectId(goodRefreshToken.userId) },
            { $set: { tokenAccess: `Bearer ${newTokenAccess}` } }, { upsert: true }
        );
        if (!(tokenExisteBDD.modifiedCount === 1 || tokenExisteBDD.upsertedCount === 1)) {
            throw new Error("Erreur lors de la création ou modification du token dans la base de données");
        }

        res.cookie("tokenAccess", `Bearer ${newTokenAccess}`, { httpOnly: true, secure: true, sameSite: "strict" });
        goodAccessToken = Outils.verifyAccessToken(`Bearer ${newTokenAccess}`, deviceFingerprint);
    }

    if (!goodAccessToken || !goodAccessToken.userId) {
        res.status(401).json({ message: "Token d'accès invalide" });
        return;
    }
    
    let tokenBDD = await TokenModel.collection.findOne({ userId: new ObjectId(goodAccessToken.userId) });
    if (!tokenBDD) {
        res.status(401).json({ message: "Token non trouvé en base" });
        return;
    }

    if (tokenBDD.tokenAccess !== tokenAccess) {
        res.status(401).json({ message: "AccessToken non reconnu" });
        return;
    }

    if (tokenBDD.tokenRefresh !== tokenRefresh) {
        res.status(401).json({ message: "RefreshToken non reconnu" });
        return;
    }

    req.auth = { userId: goodAccessToken.userId };

    return next();
}

export default authMiddleware