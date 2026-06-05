import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const querySchema = z.object({
  q: z.string().optional(),
  state: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  minFees: z.coerce.number().optional(),
  maxFees: z.coerce.number().optional(),
  minRating: z.coerce.number().optional(),
  sortBy: z.enum(['rating', 'minFees', 'nirfRank', 'name', 'reviewCount']).optional().default('rating'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(12),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = querySchema.parse(Object.fromEntries(searchParams));

    const where: any = {};

    if (params.q) {
      where.OR = [
        { name: { contains: params.q, mode: 'insensitive' } },
        { city: { contains: params.q, mode: 'insensitive' } },
        { state: { contains: params.q, mode: 'insensitive' } },
        { description: { contains: params.q, mode: 'insensitive' } },
      ];
    }

    if (params.state) where.state = { equals: params.state, mode: 'insensitive' };
    if (params.category) where.category = { equals: params.category, mode: 'insensitive' };
    if (params.type) where.type = { equals: params.type, mode: 'insensitive' };
    if (params.minFees !== undefined) where.minFees = { gte: params.minFees };
    if (params.maxFees !== undefined) where.maxFees = { lte: params.maxFees };
    if (params.minRating !== undefined) where.rating = { gte: params.minRating };

    const orderBy: any =
      params.sortBy === 'nirfRank'
        ? { nirfRank: 'asc' }
        : { [params.sortBy]: params.order };

    const skip = (params.page - 1) * params.limit;

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: params.limit,
        select: {
          id: true, slug: true, name: true, location: true, city: true,
          state: true, type: true, category: true, rating: true,
          reviewCount: true, minFees: true, maxFees: true, nirfRank: true,
          imageUrl: true, logoUrl: true, avgPackage: true, placementPct: true,
          naacGrade: true, established: true, hostel: true, scholarship: true,
        },
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      colleges,
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
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    console.error('[COLLEGES_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}