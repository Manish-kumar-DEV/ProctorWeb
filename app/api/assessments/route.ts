import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
    try {
        const assessments = await prisma.assessment.findMany({
            include: {
                questions: {
                    include: {
                        question: true,
                    },
                },
            },
        });
        return NextResponse.json(assessments);
    } catch (error) {
        console.error('Error fetching assessments:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
