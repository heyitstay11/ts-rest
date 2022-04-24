import jwt from 'jsonwebtoken';
import config from 'config';

export function signJwt(object: Object, keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey', options ?: jwt.SignOptions | undefined){
    const signinKey = config.get<string>(keyName);

    return jwt.sign(object, signinKey, {
        ...(options && options),
        algorithm: 'RS256',
    });
}

export function verifyJwt<T>(token: string, keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey'): T | null {
    const signinKey = config.get<string>(keyName);
    try {
        const decoded = jwt.verify(token, signinKey) as T;
        return decoded;
    } catch (error) {
        return null;
    }
}

