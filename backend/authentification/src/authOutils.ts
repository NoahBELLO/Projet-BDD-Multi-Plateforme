import { Request } from 'express';
import crypto from 'crypto';

export interface PayloadJWT extends Claims {
    type: string;
    expiration: number;
}

export interface Claims {
    userId: number;
    deviceFingerprint: string;
}

class Outils {
    private static base64UrlEncode(input: string): string {
        // let base64 = Buffer.from(input).toString('base64url');
        // base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // Conversion Base64 -> Base64Url
        return Buffer.from(input).toString('base64url');
    }

    // Fonction pour générer le header JWT
    private static generateHeader(): string {
        const header: object = { alg: 'HS256', typ: 'JWT' };
        return this.base64UrlEncode(JSON.stringify(header));
    }

    // Fonction pour générer le payload JWT
    private static generatePayload(payload: object): string {
        return this.base64UrlEncode(JSON.stringify(payload));
    }

    // Fonction pour signer le JWT avec une clé secrète
    private static generateSignature(header: string, payload: string, secret: string): string {
        const data: string = `${header}.${payload}`;
        return this.base64UrlEncode(crypto.createHmac('sha256', secret).update(data).digest('hex'));
    }

    static generateToken(payload: object): string {
        const header = this.generateHeader();
        const payloadBase64 = this.generatePayload(payload);
        const signature = this.generateSignature(header, payloadBase64, process.env.JWT_SECRET_KEY as string);

        return `${header}.${payloadBase64}.${signature}`;
    }

    static createGrainDeSel(nombreCaractere: number): string {
        const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result: string = '';
        for (let i: number = 0; i < nombreCaractere; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    static createNonce(datas: string) {
        let nonce: number = 0; let proofOfWork: string;
        while (true) {
            proofOfWork = crypto.createHash('sha256').update(datas + nonce).digest('hex');
            if (proofOfWork.startsWith('000')) {
                return { nonce, proofOfWork };
            }
            nonce++;
        }
    }

    static verifNonce(datas: string, nonce: number, proofOfWork: string): boolean {
        let result: string = crypto.createHash('sha256').update(datas + nonce).digest('hex');
        return result === proofOfWork && result.startsWith('000');
    }

    static createData(req: Request) {
        const issuedAt: number = Date.now();
        const deviceFingerprint: string = this.createDeviceFingerprint(req);
        return { issuedAt, deviceFingerprint };
    }

    static createDeviceFingerprint(req: Request): string {
        const fuseauHoraire: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const ipAdresse: string = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || "";
        const navigateur: string = req.headers['user-agent'] || '';
        const deviceFingerprint: string = crypto.createHash('sha256').update(ipAdresse + fuseauHoraire + navigateur).digest('hex');
        return deviceFingerprint;
    }

    static createExpiresIn(changement: boolean = true): number {
        let expiresIn: number
        if (changement) {
            expiresIn = Date.now() + 900000;
        }
        else {
            expiresIn = Date.now() + 30 * 24 * 60 * 60 * 1000;
        }
        return expiresIn;
    }

    private static verifyJWTToken(token: string = ''): PayloadJWT | false {
        const [base64Header, base64Payload, signature] = token.split('.');
        const expectedSignature = this.generateSignature(base64Header, base64Payload, process.env.JWT_SECRET_KEY as string);
        if (expectedSignature !== signature) {
            return false;
        }

        const payloadString = Buffer.from(base64Payload, 'base64url').toString();
        const payload: PayloadJWT = JSON.parse(payloadString);
        if (payload.expiration && Date.now() > payload.expiration) {
            return false;
        }

        return payload;
    }

    private static fingerprintTokenVerify(claims1: string, claims2: string): boolean {
        return (claims1 === claims2);
    }

    static verifyAccessToken(token: string = '', deviceFingerprint: string): false | PayloadJWT {
        const [status, newToken] = token.split(' ');

        if (status !== 'Bearer') {
            return false;
        }

        const accessToken = this.verifyJWTToken(newToken);
        if (!accessToken) {
            return false;
        }

        const fingerprintVerify = this.fingerprintTokenVerify(deviceFingerprint, accessToken.deviceFingerprint);
        if (!fingerprintVerify) {
            return false;
        }

        return accessToken;
    }

    static verifyRefreshToken(token: string = '', fingerprint: string): false | PayloadJWT {
        const refreshToken = this.verifyJWTToken(token);

        if (!refreshToken) {
            return false;
        }

        const fingerprintVerify = this.fingerprintTokenVerify(fingerprint, refreshToken.deviceFingerprint)

        if (!fingerprintVerify) {
            return false;
        }

        return refreshToken;
    }
}

export default Outils;