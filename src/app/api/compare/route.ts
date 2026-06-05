import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const { slugs } = z.object({ slugs: z.array(z.string()).min(2).max(3) }).parse(await req.json());
    const colleges = await prisma.college.findMany({
      where: { slug: { in: slugs } },
      include: { courses: true },
    });
    const sorted = slugs.map((slug) => colleges.find((c) => c.slug === slug)).filter(Boolean);
    return NextResponse.json({ colleges: sorted });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}