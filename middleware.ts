import { NextRequest } from "next/server";
import { updateSession, } from "./utils/validation";

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

// async function updateSession(request: NextRequest) {
//     const session = request.cookies.get("authToken")?.value;
//     if (!session) return;
//     const { isValid, user } = validateToken(request);
//     if (!isValid) {
//         return NextResponse.redirect("/login");
//     }
//     const cookies = request.cookies();
//     cookies.set("authToken", generateToken(user), {
//         httpOnly: true,
//         sameSite: "strict",
//         secure: process.env.NODE_ENV === "production",
//         maxAge: 60 * 60 * 24 * 30,
//         path: "/",
//     });
//     return NextResponse.next();
// }


