import { NextRequest } from "next/server";
import { updateSession, } from "./utils/validation";

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

