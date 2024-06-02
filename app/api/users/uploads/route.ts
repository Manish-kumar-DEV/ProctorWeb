// app/api/users/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/utils/cloudinary';
import prisma from '@/prisma/prisma';
import fs from 'fs';
import path from 'path';
import { encrypt } from '@/utils/validation';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const userId = data.get('userId') as string;
        const file = data.get('file') as File;

        if (!userId || !file) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }


        // Verify if the user exists
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            console.log("User not found for userId:", userId);
            cookies().delete("authSession");
            return NextResponse.redirect(new URL('/login', req.url));
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const tempPath = path.join('/tmp', file.name);

        // Save file temporarily to disk
        await fs.promises.writeFile(tempPath, buffer);

        // Upload image to Cloudinary
        const imageUrl = await uploadImageToCloudinary(tempPath);

        // Clean up temporary file
        await fs.promises.unlink(tempPath);

        // Save image URL in the database
        await prisma.userImage.create({
            data: {
                userId,
                imageUrl,
            },
        });

        // Update the User table with the new image URL
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { pictureUrl: imageUrl },
        });

        //update session data
        const sessionData = { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, pictureUrl: updatedUser.pictureUrl };
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        const session = await encrypt({ sessionData, exp: Math.floor(expires.getTime() / 1000) });

        const isDev = process.env.NODE_ENV === 'development';

        cookies().set('authSession', session, {
            httpOnly: true,
            secure: !isDev,
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return NextResponse.json({ imageUrl }, { status: 200 });
    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
