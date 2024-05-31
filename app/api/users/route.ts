import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

import { cookies } from 'next/headers'

import { encrypt, hashPassword } from '@/utils/validation';
import { MAX_COOKIE_AGE } from '@/utils/constants';



export async function POST(req: NextRequest) {
    const { name, email, password, roles = [] } = await req.json();

    try {
        // Validate roles
        const validRoles = ['USER', 'ADMIN', 'SUPERADMIN'];
        const userRoles = new Set(['USER', ...roles.map((role: string) => role.toUpperCase())]);

        // Filter out any invalid roles
        const filteredRoles = Array.from(userRoles).filter((role) => validRoles.includes(role));

        if (filteredRoles.length !== userRoles.size) {
            return NextResponse.json({ error: 'Invalid roles provided' }, { status: 400 });
        }
        const roleRecords = await prisma.role.findMany({
            where: {
                type: {
                    in: filteredRoles,
                },
            },
        });

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roles: {
                    create: roleRecords.map((role) => ({
                        roleId: role.id,
                    })),
                },
            },
        });

        const expires = new Date(Date.now() + MAX_COOKIE_AGE);
        const sessionData = { id: user.id, name: user.name, email: user.email }
        const session = await encrypt({ sessionData, expires });

        const isDev = process.env.NODE_ENV === 'development';

        cookies().set('authSession', session, {
            httpOnly: true,
            secure: !isDev,
            maxAge: MAX_COOKIE_AGE,
            path: '/',
        })

        return NextResponse.json({ id: user.id, name: user.name, email: user.email, pictureUrl: user.pictureUrl }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}