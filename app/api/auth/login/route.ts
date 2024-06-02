import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { encrypt, validatePassword } from '@/utils/validation';
import { MAX_COOKIE_AGE } from '@/utils/constants';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { roles: true },
        });

        if (!user || !(await validatePassword(password, user.password))) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const expires = new Date(Date.now() + MAX_COOKIE_AGE);
        const sessionData = { id: user.id, name: user.name, email: user.email, pictureUrl: user.pictureUrl };
        const session = await encrypt({ sessionData, exp: expires });

        const isDev = process.env.NODE_ENV === 'development';
        cookies().set({
            name: 'authSession',
            value: session,
            httpOnly: true,
            secure: !isDev,
            maxAge: MAX_COOKIE_AGE,
            path: '/',
        });


        return NextResponse.json(
            { id: user.id, name: user.name, email: user.email },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
