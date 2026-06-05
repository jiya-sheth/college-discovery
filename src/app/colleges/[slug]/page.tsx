import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CollegeDetailClient } from '@/components/college/college-detail-client';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const college = await prisma.college.findUnique({ where: { slug: params.slug }, select: { name: true, location: true } });
  if (!college) return { title: 'Not Found' };
  return { title: `${college.name} — CollegeCompass`, description: `Explore ${college.name} in ${college.location}` };
}

async function getCollege(slug: string) {
  return prisma.college.findUnique({
    where: { slug },
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
}

export default async function CollegeDetailPage({ params }: Props) {
  const college = await getCollege(params.slug);
  if (!college) notFound();

  return <CollegeDetailClient college={college} />;
}