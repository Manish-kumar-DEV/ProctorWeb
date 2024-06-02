import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const assessment = await prisma.assessment.findUnique({
            where: { id: id },
            include: {
                questions: {
                    include: {
                        question: true,
                    },
                },
            },
        });

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        return NextResponse.json(assessment);
    } catch (error) {
        console.error('Error fetching assessment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
