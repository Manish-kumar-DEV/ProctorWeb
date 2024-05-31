import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from "jose";
import { cookies } from 'next/headers';
import { MAX_COOKIE_AGE } from './constants';

export const JWT_SECRET = process.env.JWT_SECRET || 'demo_secret_key';
const key = new TextEncoder().encode(JWT_SECRET);

export interface IUserToken {
    id: string;
    name: string;
    email: string;
    pictureUrl?: string;
}


export async function hashPassword(password: string): Promise<any> {
    return await bcrypt.hash(password, 10);
}

export const validatePassword = async (plainPassword: string, hashedPassword: string): Promise<any> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};


export async function encrypt(payload: any) {

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7 days") //MAX_COOKIE_AGE
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function getSession() {
    const session = cookies().get("authSession")?.value;
    if (!session) return null;
    return await decrypt(session);
}


export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("authSession")?.value;
    if (!session) return;

    const parsed = await decrypt(session);

    const expiryThreshold = 5 * 60 * 1000; // 5 minutes
    const currentTime = Date.now();
    const sessionExpiryTime = parsed.exp * 1000;

    if (sessionExpiryTime - currentTime < expiryThreshold) {
        parsed.exp = Math.floor(currentTime / 1000) + (MAX_COOKIE_AGE / 1000);
        const newToken = await encrypt(parsed);

        const res = NextResponse.next();
        res.cookies.set({
            name: 'authSession',
            value: newToken,
            httpOnly: true,
            expires: new Date(currentTime + MAX_COOKIE_AGE),
        });
        return res;
    }
    return NextResponse.next();

    // parsed.expires = new Date(Date.now() + MAX_COOKIE_AGE);
    // const res = NextResponse.next();
    // console.log('Going to set the cookie')
    // res.cookies.set({
    //     name: "authSession",
    //     value: await encrypt(parsed),
    //     httpOnly: true,
    //     expires: parsed.expires,
    // });
    // return res;
}


//using JWT -> not using this one currently
// export const generateToken = (user: IUserToken): string => {
//     return jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
// };
// export function validateToken(req: NextRequest) {
//     const cookies = parse(req.headers.get('cookie') || '');
//     const token = cookies.token;

//     if (!token) {
//         return { isValid: false, user: null };
//     }
//     try {
//         const user = jwt.verify(token, JWT_SECRET);
//         return { isValid: true, user };
//     } catch (error) {
//         return { isValid: false, user: null };
//     }
// }