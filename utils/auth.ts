import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import Cookies from 'js-cookie';
import { MAX_COOKIE_AGE } from './constants';

export const JWT_SECRET = process.env.JWT_SECRET || 'demo_secret_key';
const key = new TextEncoder().encode(JWT_SECRET);

export interface IUserToken {
    id: string;
    name: string;
    email: string;
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

export const validatePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export async function encrypt(payload: any): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // MAX_COOKIE_AGE
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export function setSession(session: string): void {

    // Check if the session is close to expiring
    const currentTime = Date.now();
    const parsedSession = JSON.parse(atob(session.split('.')[1]));
    const sessionExpiryTime = parsedSession.exp * 1000; // `exp` is in seconds

    // Update session only if it's close to expiring (within 5 minutes)
    const expiryThreshold = 5 * 60 * 1000; // 5 minutes

    if (sessionExpiryTime - currentTime < expiryThreshold) {
        const newExpiryTime = new Date(currentTime + MAX_COOKIE_AGE); // 7 days
        Cookies.set('authSession', session, {
            expires: newExpiryTime,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });
    }
}

export function getSession(): string | undefined {
    return Cookies.get('authSession');
}

export function removeSession(): void {
    Cookies.remove('authSession', { path: '/' });
}
