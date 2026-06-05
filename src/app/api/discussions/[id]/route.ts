import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, image: true } },
        answers: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: [{ isAccepted: 'desc' }, { upvotes: 'desc' }],
        },
      },
    });

    if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // increment views
    await prisma.question.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}