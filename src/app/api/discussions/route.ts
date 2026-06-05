import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const querySchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  sort: z.enum(['latest', 'popular', 'unanswered']).default('latest'),
});

const createSchema = z.object({
  title: z.string().min(10).max(200),
  content: z.string().min(20).max(5000),
  tags: z.array(z.string()).max(5).default([]),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = querySchema.parse(Object.fromEntries(searchParams));
    const skip = (params.page - 1) * params.limit;

    const where: any = {};
    if (params.q) {
      where.OR = [
        { title: { contains: params.q, mode: 'insensitive' } },
        { content: { contains: params.q, mode: 'insensitive' } },
      ];
    }
    if (params.tag) where.tags = { has: params.tag };
    if (params.sort === 'unanswered') where.answers = { none: {} };

    const orderBy: any =
      params.sort === 'popular'
        ? { upvotes: 'desc' }
        : { createdAt: 'desc' };

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        orderBy,
        skip,
        take: params.limit,
        include: {
          user: { select: { id: true, name: true, image: true } },
          _count: { select: { answers: true } },
        },
      }),
      prisma.question.count({ where }),
    ]);

    return NextResponse.json({
      questions,
      pagination: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit),
        hasMore: skip + params.limit < total,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = z.object({
      title: z.string().min(10).max(200),
      content: z.string().min(20).max(5000),
      tags: z.array(z.string()).default([]),
    }).parse(await req.json());
    const userId = (session.user as any).id;
    const question = await prisma.question.create({
      data: {
        title: body.title,
        content: body.content,
        tags: body.tags,
        user: { connect: { id: userId } },
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { answers: true } },
      },
    });
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}