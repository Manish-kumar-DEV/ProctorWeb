import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/utils/validation';

export async function GET(request: NextRequest) {
    const session = request.cookies.get("authSession")?.value;
    if (!session) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    try {
        const user = await decrypt(session);
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }
}
