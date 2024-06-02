import { NextRequest, NextResponse } from "next/server";
import { updateSession, } from "./utils/validation";

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const isAuthRequired = pathname.startsWith("/dashboard");

    if (!isAuthRequired) {
        return NextResponse.next();
    }

    const session = request.cookies.get("authSession")?.value;
    if (!session) {
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
    }

    const response = await updateSession(request);
    return response;
}


export const config = {
    matcher: [
        '/dashboard/:path*',
    ],
};

