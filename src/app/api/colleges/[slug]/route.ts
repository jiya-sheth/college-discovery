import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const college = await prisma.college.findUnique({
      where: { slug: params.slug },
      include: {
        courses: { orderBy: { degree: 'asc' } },
        reviews: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { helpful: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true, savedBy: true } },
      },
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error('[COLLEGE_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}