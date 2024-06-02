

export const MAX_COOKIE_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days in seconds

export interface Assessment {
    id: string;
    title: string;
    description: string;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
    assessmentId: string;
    questionId: string;
    assessment: Assessment;
    question: Question;
    createdAt: Date;
    updatedAt: Date;
}

export interface Question {
    id: string;
    text: string;
    answers: { id: string; text: string }[];
    correctAnswerId: string;
    createdAt: Date;
    updatedAt: Date;
    assessments: AssessmentQuestion[];
}