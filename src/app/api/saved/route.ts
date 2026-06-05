import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;

    const [savedColleges, savedComparisons] = await Promise.all([
      prisma.savedCollege.findMany({
        where: { userId },
        include: {
          college: {
            select: {
              id: true, slug: true, name: true, location: true, city: true,
              state: true, type: true, category: true, rating: true,
              reviewCount: true, minFees: true, maxFees: true, nirfRank: true,
              imageUrl: true, avgPackage: true, placementPct: true, naacGrade: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.savedComparison.findMany({
        where: { userId },
        include: {
          collegeA: { select: { id: true, slug: true, name: true, imageUrl: true } },
          collegeB: { select: { id: true, slug: true, name: true, imageUrl: true } },
          collegeC: { select: { id: true, slug: true, name: true, imageUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({ savedColleges, savedComparisons });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { collegeId } = z.object({ collegeId: z.string() }).parse(await req.json());
    const userId = (session.user as any).id;

    const existing = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId, collegeId } },
    });

    if (existing) {
      await prisma.savedCollege.delete({ where: { userId_collegeId: { userId, collegeId } } });
      return NextResponse.json({ saved: false });
    }

    await prisma.savedCollege.create({ data: { userId, collegeId } });
    return NextResponse.json({ saved: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}