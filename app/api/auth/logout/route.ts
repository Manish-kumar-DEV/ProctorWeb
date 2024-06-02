import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    const res = NextResponse.json({ message: "Logged out" });
    cookies().set({
        name: 'authSession',
        value: '',
        httpOnly: true,
        maxAge: -1, // Expire the cookie immediately
        path: '/',
    });
    return res;
}