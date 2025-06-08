import { Request, Response, NextFunction } from "express";
import Outils from "./outils";
import { ObjectId } from "mongodb";
import { TokenModel } from "./tokenModel";

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
        return next();
    }

    const deviceFingerprint: string = Outils.createDeviceFingerprint(req);

    // changer la partie verif pour intergrer la generation accesstoken avec refreshtoken
    const goodAccessToken = Outils.verifyAccessToken(tokenAccess, deviceFingerprint);
    if (!goodAccessToken) {
        return next();
    }

    const goodRefreshToken = Outils.verifyRefreshToken(tokenRefresh, deviceFingerprint);
    if (!goodRefreshToken) {
        return next();
    }

    let tokenBDD = await TokenModel.collection.findOne({ userId: new ObjectId(goodAccessToken.userId) });
    if (!tokenBDD) {
        return next();
    }

    if (tokenBDD.tokenAccess !== tokenAccess) {
        return next();
    }

    if (tokenBDD.tokenRefresh !== tokenRefresh) {
        return next();
    }

    req.auth = { userId: goodAccessToken.userId };

    return next();
}

export default authMiddleware