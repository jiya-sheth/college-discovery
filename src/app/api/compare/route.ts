import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const compareSchema = z.object({
  slugs: z.array(z.string()).min(2).max(3),
});

const saveSchema = z.object({
  collegeAId: z.string(),
  collegeBId: z.string(),
  collegeCId: z.string().optional(),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = compareSchema.parse(await req.json());

    const colleges = await prisma.college.findMany({
      where: { slug: { in: body.slugs } },
      include: {
        courses: { orderBy: { degree: 'asc' } },
        _count: { select: { reviews: true } },
      },
    });

    // sort in same order as slugs
    const sorted = body.slugs.map((slug) => colleges.find((c) => c.slug === slug)).filter(Boolean);

    return NextResponse.json({ colleges: sorted });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = saveSchema.parse(await req.json());
    const userId = (session.user as any).id;

    const saved = await prisma.savedComparison.create({
      data: { userId, ...body },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}