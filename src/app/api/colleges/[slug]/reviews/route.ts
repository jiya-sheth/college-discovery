import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5).max(100),
  content: z.string().min(20).max(2000),
  pros: z.string().optional(),
  cons: z.string().optional(),
  batch: z.number().optional(),
  program: z.string().optional(),
});

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const college = await prisma.college.findUnique({ where: { slug: params.slug } });
    if (!college) return NextResponse.json({ error: 'College not found' }, { status: 404 });

    const body = reviewSchema.parse(await req.json());
    const userId = (session.user as any).id;

    const existing = await prisma.review.findFirst({ where: { collegeId: college.id, userId } });
    if (existing) {
      return NextResponse.json({ error: 'You have already reviewed this college' }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: { ...body, collegeId: college.id, userId },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    // Update college rating
    const avg = await prisma.review.aggregate({
      where: { collegeId: college.id },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.college.update({
      where: { id: college.id },
      data: { rating: avg._avg.rating ?? 0, reviewCount: avg._count },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('[REVIEW_POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}