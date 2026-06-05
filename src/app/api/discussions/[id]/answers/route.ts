import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const answerSchema = z.object({
  content: z.string().min(10).max(5000),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const question = await prisma.question.findUnique({ where: { id: params.id } });
    if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    const body = answerSchema.parse(await req.json());
    const userId = (session.user as any).id;

    const answer = await prisma.answer.create({
      data: { content: body.content, questionId: params.id, userId },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}