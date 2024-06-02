import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function truncateAllTables() {
    await client.connect();

    await client.query(`
    DO $$ DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'ALTER TABLE ' || quote_ident(r.tablename) || ' DISABLE TRIGGER ALL';
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
            EXECUTE 'ALTER TABLE ' || quote_ident(r.tablename) || ' ENABLE TRIGGER ALL';
        END LOOP;
    END $$;
  `);

    await client.end();
}

async function seedDatabase() {
    console.log('Started seeding...')
    try {
        // Truncate all tables
        await truncateAllTables();

        const userPassword = 'password123';
        const hashedPassword = await bcrypt.hash(userPassword, 10);

        // Create Users
        const user1 = await prisma.user.create({
            data: {
                name: "Alice",
                email: "alice@example.com",
                password: hashedPassword,
                pictureUrl: "https://example.com/alice.jpg",
            },
        });

        const user2 = await prisma.user.create({
            data: {
                name: "Bob",
                email: "bob@example.com",
                password: hashedPassword,
                pictureUrl: "https://example.com/bob.jpg",
            },
        });

        console.log("Users created:", user1.id, user2.id);

        // Create Questions
        const questionsData = [
            {
                text: "What is the time complexity of binary search?",
                answers: JSON.stringify([
                    { id: "1", text: "O(n)" },
                    { id: "2", text: "O(log n)" },
                    { id: "3", text: "O(n^2)" },
                    { id: "4", text: "O(n log n)" },
                ]),
                correctAnswerId: "2",
            },
            {
                text: "Which data structure is used to implement a queue?",
                answers: JSON.stringify([
                    { id: "1", text: "Array" },
                    { id: "2", text: "Stack" },
                    { id: "3", text: "Linked List" },
                    { id: "4", text: "Tree" },
                ]),
                correctAnswerId: "3",
            },
            {
                text: "What is the output of the following code: console.log(typeof null);",
                answers: JSON.stringify([
                    { id: "1", text: "null" },
                    { id: "2", text: "object" },
                    { id: "3", text: "undefined" },
                    { id: "4", text: "string" },
                ]),
                correctAnswerId: "2",
            },
            {
                text: "Which sorting algorithm is considered the fastest in practice?",
                answers: JSON.stringify([
                    { id: "1", text: "Bubble Sort" },
                    { id: "2", text: "Merge Sort" },
                    { id: "3", text: "Quick Sort" },
                    { id: "4", text: "Selection Sort" },
                ]),
                correctAnswerId: "3",
            },
            {
                text: "What is the main advantage of using a linked list over an array?",
                answers: JSON.stringify([
                    { id: "1", text: "Faster access time" },
                    { id: "2", text: "Dynamic size" },
                    { id: "3", text: "Less memory usage" },
                    { id: "4", text: "Simpler to implement" },
                ]),
                correctAnswerId: "2",
            },
            {
                text: "What does HTTP stand for?",
                answers: JSON.stringify([
                    { id: "1", text: "HyperText Transfer Protocol" },
                    { id: "2", text: "HyperText Transfer Program" },
                    { id: "3", text: "HyperText Transmission Protocol" },
                    { id: "4", text: "HyperText Transfer Page" },
                ]),
                correctAnswerId: "1",
            },
            {
                text: "Which of the following is a NoSQL database?",
                answers: JSON.stringify([
                    { id: "1", text: "MySQL" },
                    { id: "2", text: "MongoDB" },
                    { id: "3", text: "PostgreSQL" },
                    { id: "4", text: "SQLite" },
                ]),
                correctAnswerId: "2",
            },
            {
                text: "What is the primary purpose of DNS in networking?",
                answers: JSON.stringify([
                    { id: "1", text: "To provide a backup connection" },
                    { id: "2", text: "To secure network traffic" },
                    { id: "3", text: "To translate domain names to IP addresses" },
                    { id: "4", text: "To monitor network performance" },
                ]),
                correctAnswerId: "3",
            },
            {
                text: "What is the output of the following code: '2' + 2;",
                answers: JSON.stringify([
                    { id: "1", text: "4" },
                    { id: "2", text: "'22'" },
                    { id: "3", text: "undefined" },
                    { id: "4", text: "NaN" },
                ]),
                correctAnswerId: "2",
            },
            {
                text: "Which protocol is used to send email?",
                answers: JSON.stringify([
                    { id: "1", text: "FTP" },
                    { id: "2", text: "HTTP" },
                    { id: "3", text: "SMTP" },
                    { id: "4", text: "IMAP" },
                ]),
                correctAnswerId: "3",
            },
        ];

        await prisma.question.createMany({
            data: questionsData,
        });

        console.log("Questions created");

        // Retrieve created questions
        const allQuestions = await prisma.question.findMany();
        console.log("Retrieved questions:", allQuestions.length);

        // Create an assessment if it doesn't already exist
        const assessmentExists = await prisma.assessment.findFirst({
            where: { title: "Basic Computer Science Assessment" },
        });

        const assessment = assessmentExists || await prisma.assessment.create({
            data: {
                title: "Basic Computer Science Assessment",
                description: "An assessment covering basic concepts in computer science.",
                createdById: user1.id,
            },
        });

        console.log("Assessment created or exists:", assessment.id);

        // Group Questions into the Assessment, ensuring no duplicates
        for (const question of allQuestions) {
            const existingAQ = await prisma.assessmentQuestion.findFirst({
                where: {
                    assessmentId: assessment.id,
                    questionId: question.id,
                },
            });

            if (!existingAQ) {
                await prisma.assessmentQuestion.create({
                    data: {
                        assessmentId: assessment.id,
                        questionId: question.id,
                    },
                });
            }
        }

        console.log("Questions grouped into assessment");

        // Check if user assessment already exists
        const userAssessmentExists = await prisma.userAssessment.findFirst({
            where: {
                userId: user2.id,
                assessmentId: assessment.id,
            },
        });

        // Assign the Assessment to a User if not already assigned
        if (!userAssessmentExists) {
            await prisma.userAssessment.create({
                data: {
                    userId: user2.id,
                    assessmentId: assessment.id,
                    status: "assigned",
                },
            });
        }

        console.log("User assessment assigned");
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        console.log('Seeding complete!..')
        await prisma.$disconnect();
    }
}

seedDatabase()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
