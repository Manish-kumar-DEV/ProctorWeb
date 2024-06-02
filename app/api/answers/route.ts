import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(req: NextRequest) {
    try {
        const { userId, questionId, assessmentId, selectedAnswerId } = await req.json();
        console.log('The data is ', { userId, questionId, assessmentId, selectedAnswerId })

        const userExists = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!userExists) {
            return NextResponse.json({ error: 'User does not exist' }, { status: 400 });
        }

        // Verify that the question and assessment exist
        const questionExists = await prisma.question.findUnique({
            where: { id: questionId },
        });

        const assessmentExists = await prisma.assessment.findUnique({
            where: { id: assessmentId },
        });

        if (!questionExists) {
            return NextResponse.json({ error: 'Question does not exist' }, { status: 400 });
        }

        if (!assessmentExists) {
            return NextResponse.json({ error: 'Assessment does not exist' }, { status: 400 });
        }
        // Upsert user answer
        const userAnswer = await prisma.userAnswer.upsert({
            where: {
                userId_questionId_assessmentId: {
                    userId,
                    questionId,
                    assessmentId,
                },
            },
            update: { selectedAnswerId },
            create: {
                userId,
                questionId,
                assessmentId,
                selectedAnswerId,
            },
        });

        return NextResponse.json(userAnswer);
    } catch (error) {
        console.error('Error saving user answer:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
