import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const predictorSchema = z.object({
  exam: z.string().min(1),
  rank: z.coerce.number().min(1),
  category: z.string().optional().default('General'),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = predictorSchema.parse(Object.fromEntries(searchParams));

    // Find matching predictor results
    const results = await prisma.predictorResult.findMany({
      where: {
        exam: { equals: params.exam, mode: 'insensitive' },
        minRank: { lte: params.rank },
        maxRank: { gte: params.rank },
        OR: [
          { category: { equals: params.category, mode: 'insensitive' } },
          { category: null },
        ],
      },
      include: {
        college: {
          select: {
            id: true, slug: true, name: true, location: true, city: true,
            state: true, category: true, type: true, rating: true,
            minFees: true, maxFees: true, avgPackage: true, placementPct: true,
            nirfRank: true, imageUrl: true, reviewCount: true, naacGrade: true,
          },
        },
      },
      orderBy: { minRank: 'asc' },
    });

    // Deduplicate by college
    const seen = new Set<string>();
    const colleges = results
      .filter((r) => {
        if (seen.has(r.collegeId)) return false;
        seen.add(r.collegeId);
        return true;
      })
      .map((r) => ({
        ...r.college,
        predictorMeta: {
          exam: r.exam,
          minRank: r.minRank,
          maxRank: r.maxRank,
          category: r.category,
          chance: getAdmissionChance(params.rank, r.minRank, r.maxRank),
        },
      }));

    // If no exact results, return nearest colleges
    if (colleges.length === 0) {
      const nearest = await prisma.predictorResult.findMany({
        where: { exam: { contains: params.exam, mode: 'insensitive' } },
        include: {
          college: {
            select: {
              id: true, slug: true, name: true, location: true, city: true,
              state: true, category: true, type: true, rating: true,
              minFees: true, maxFees: true, avgPackage: true, placementPct: true,
              nirfRank: true, imageUrl: true, reviewCount: true, naacGrade: true,
            },
          },
        },
        orderBy: { minRank: 'asc' },
        take: 5,
      });

      const nearestColleges = nearest.map((r) => ({
        ...r.college,
        predictorMeta: {
          exam: r.exam,
          minRank: r.minRank,
          maxRank: r.maxRank,
          category: r.category,
          chance: getAdmissionChance(params.rank, r.minRank, r.maxRank),
        },
      }));

      return NextResponse.json({ colleges: nearestColleges, isApproximate: true });
    }

    return NextResponse.json({ colleges, isApproximate: false });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }
    console.error('[PREDICTOR_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getAdmissionChance(rank: number, minRank: number, maxRank: number): 'High' | 'Medium' | 'Low' {
  const range = maxRank - minRank;
  const position = rank - minRank;
  const pct = range > 0 ? position / range : 0.5;

  if (pct < 0.3) return 'High';
  if (pct < 0.7) return 'Medium';
  return 'Low';
}