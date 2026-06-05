import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const colleges = [
  {
    name: 'Indian Institute of Technology Bombay',
    slug: 'iit-bombay',
    location: 'Powai, Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'Public',
    category: 'Engineering',
    established: 1958,
    website: 'https://www.iitb.ac.in',
    imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800',
    description: 'IIT Bombay is one of the premier engineering institutions of India. Established in 1958, it has grown into a globally recognized university offering undergraduate, postgraduate and doctoral programs.',
    rating: 4.8, reviewCount: 1240, minFees: 200000, maxFees: 250000,
    nirfRank: 3, qsRank: 149, avgPackage: 2200000, maxPackage: 25000000, placementPct: 95,
    hostel: true, scholarship: true, sports: true, labs: true, library: true,
    accreditation: 'NAAC', naacGrade: 'A++',
  },
  {
    name: 'Indian Institute of Technology Delhi',
    slug: 'iit-delhi',
    location: 'Hauz Khas, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    type: 'Public',
    category: 'Engineering',
    established: 1961,
    website: 'https://www.iitd.ac.in',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    description: 'IIT Delhi is one of the foremost institutes of national importance in the field of technology and offers a wide range of programs in engineering and sciences.',
    rating: 4.7, reviewCount: 980, minFees: 200000, maxFees: 250000,
    nirfRank: 2, qsRank: 185, avgPackage: 2100000, maxPackage: 22000000, placementPct: 94,
    hostel: true, scholarship: true, sports: true, labs: true, library: true,
    accreditation: 'NAAC', naacGrade: 'A++',
  },
  {
    name: 'Indian Institute of Technology Madras',
    slug: 'iit-madras',
    location: 'Adyar, Chennai, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'Public',
    category: 'Engineering',
    established: 1959,
    website: 'https://www.iitm.ac.in',
    imageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800',
    description: 'IIT Madras is consistently ranked the top engineering institute in India by NIRF. It is a residential institute situated in a 617-acre campus.',
    rating: 4.9, reviewCount: 1560, minFees: 200000, maxFees: 250000,
    nirfRank: 1, qsRank: 227, avgPackage: 2400000, maxPackage: 28000000, placementPct: 96,
    hostel: true, scholarship: true, sports: true, labs: true, library: true,
    accreditation: 'NAAC', naacGrade: 'A++',
  },
  {
    name: 'BITS Pilani',
    slug: 'bits-pilani',
    location: 'Vidya Vihar, Pilani, Rajasthan',
    city: 'Pilani',
    state: 'Rajasthan',
    type: 'Deemed',
    category: 'Engineering',
    established: 1964,
    website: 'https://www.bits-pilani.ac.in',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
    description: 'BITS Pilani is a deemed university known for its practice school program and strong industry connections.',
    rating: 4.5, reviewCount: 870, minFees: 450000, maxFees: 550000,
    nirfRank: 25, qsRank: null, avgPackage: 1800000, maxPackage: 18000000, placementPct: 91,
    hostel: true, scholarship: true, sports: true, labs: true, library: true,
    accreditation: 'NAAC', naacGrade: 'A',
  },
  {
    name: 'National Institute of Technology Trichy',
    slug: 'nit-trichy',
    location: 'Tanjore Main Road, Tiruchirappalli, Tamil Nadu',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    type: 'Public',
    category: 'Engineering',
    established: 1964,
    website: 'https://www.nitt.edu',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    description: 'NIT Trichy is consistently ranked among the top NITs in India with excellent programs in engineering and strong placement records.',
    rating: 4.3, reviewCount: 620, minFees: 150000, maxFees: 200000,
    nirfRank: 8, qsRank: null, avgPackage: 1400000, maxPackage: 12000000, placementPct: 88,
    hostel: true, scholarship: true, sports: true, labs: true, library: true,
    accreditation: 'NAAC', naacGrade: 'A',
  },
  {
    name: 'Vellore Institute of Technology',
    slug: 'vit-vellore',
    location: 'Vellore, Tamil Nadu',
    city: 'Vellore',
    state: 'Tamil Nadu',
    type: 'Deemed',
    category: 'Engineering',
    established: 1984,
    website: 'https://vit.ac.in',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    description: 'VIT Vellore is a prestigious private deemed university known for its technology programs and excellent campus infrastructure.',
    rating: 4.1, reviewCount: 2100, minFees: 350000, maxFees: 420000,
    nirfRank: 11, qsRank: null, avgPackage: 900000, maxPackage: 8000000, placementPct: 85,
    hostel: true, scholarship: true, sports: true, labs: true, library: true,
    accreditation: 'NAAC', naacGrade: 'A++',
  },
  {
    name: 'Indian Institute of Management Ahmedabad',
    slug: 'iima',
    location: 'Vastrapur, Ahmedabad, Gujarat',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'Public',
    category: 'Management',
    established: 1961,
    website: 'https://www.iima.ac.in',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    description: 'IIM Ahmedabad is the top management institute in India, ranked among the top business schools globally.',
    rating: 4.9, reviewCount: 890, minFees: 2300000, maxFees: 2500000,
    nirfRank: 1, qsRank: 44, avgPackage: 3500000, maxPackage: 70000000, placementPct: 100,
    hostel: true, scholarship: true, sports: true, labs: true, library: true,
    accreditation: 'AACSB', naacGrade: null,
  },
  {
    name: 'All India Institute of Medical Sciences Delhi',
    slug: 'aiims-delhi',
    location: 'Ansari Nagar, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    type: 'Public',
    category: 'Medical',
    established: 1956,
    website: 'https://www.aiims.edu',
    imageUrl: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800',
    description: 'AIIMS Delhi is the premier medical institution in India offering MBBS, MD, MS and other healthcare programs.',
    rating: 4.8, reviewCount: 760, minFees: 1000, maxFees: 6500,
    nirfRank: 1, qsRank: null, avgPackage: 1200000, maxPackage: 5000000, placementPct: 99,
    hostel: true, scholarship: true, sports: false, labs: true, library: true,
    accreditation: 'MCI', naacGrade: 'A++',
  },
  {
    name: 'Delhi University',
    slug: 'delhi-university',
    location: 'North Campus, Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    type: 'Public',
    category: 'Arts',
    established: 1922,
    website: 'https://www.du.ac.in',
    imageUrl: 'https://images.unsplash.com/photo-1567168544649-b37863b6e8b5?w=800',
    description: 'University of Delhi is one of the largest and most prestigious central universities in India offering a wide range of undergraduate and postgraduate programs.',
    rating: 4.0, reviewCount: 3200, minFees: 15000, maxFees: 80000,
    nirfRank: 11, qsRank: null, avgPackage: 600000, maxPackage: 3000000, placementPct: 65,
    hostel: true, scholarship: true, sports: true, labs: true, library: true,
    accreditation: 'NAAC', naacGrade: 'A++',
  },
  {
    name: 'Manipal Institute of Technology',
    slug: 'manipal-institute-technology',
    location: 'Udupi, Karnataka',
    city: 'Manipal',
    state: 'Karnataka',
    type: 'Deemed',
    category: 'Engineering',
    established: 1957,
    website: 'https://manipal.edu/mit',
    imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800',
    description: 'MIT Manipal is a leading engineering institution known for its industry-oriented curriculum and strong alumni network.',
    rating: 4.2, reviewCount: 1800, minFees: 280000, maxFees: 350000,
    nirfRank: 35, qsRank: null, avgPackage: 800000, maxPackage: 7000000, placementPct: 82,
    hostel: true, scholarship: true, sports: true, labs: true, library: true,
    accreditation: 'NAAC', naacGrade: 'A++',
  },
];

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: { email: 'demo@example.com', name: 'Demo User', password: hashedPassword },
    }),
    prisma.user.upsert({
      where: { email: 'student@example.com' },
      update: {},
      create: { email: 'student@example.com', name: 'Rahul Sharma', password: hashedPassword },
    }),
    prisma.user.upsert({
      where: { email: 'priya@example.com' },
      update: {},
      create: { email: 'priya@example.com', name: 'Priya Patel', password: hashedPassword },
    }),
  ]);

  const createdColleges = [];

  for (const college of colleges) {
    const created = await prisma.college.upsert({
      where: { slug: college.slug },
      update: {},
      create: college,
    });
    createdColleges.push(created);

    const isManagement = college.category === 'Management';
    const isMedical = college.category === 'Medical';
    const isArts = college.category === 'Arts';

    let courses;
    if (isManagement) {
      courses = [
        { name: 'Post Graduate Programme', degree: 'MBA', duration: 2, seats: 385, exams: ['CAT', 'GMAT'] },
        { name: 'Executive MBA', degree: 'MBA', duration: 1, seats: 60, exams: ['CAT', 'GMAT'] },
      ];
    } else if (isMedical) {
      courses = [
        { name: 'Bachelor of Medicine and Surgery', degree: 'MBBS', duration: 5, seats: 100, exams: ['NEET'] },
        { name: 'MD Internal Medicine', degree: 'MD', duration: 3, seats: 20, exams: ['NEET PG'] },
      ];
    } else if (isArts) {
      courses = [
        { name: 'Bachelor of Arts (Hons) English', degree: 'BA', duration: 3, seats: 60, exams: ['CUET'] },
        { name: 'Bachelor of Commerce (Hons)', degree: 'BCom', duration: 3, seats: 80, exams: ['CUET'] },
      ];
    } else {
      courses = [
        { name: 'Computer Science and Engineering', degree: 'B.Tech', duration: 4, seats: 120, exams: ['JEE Advanced', 'JEE Main'] },
        { name: 'Electrical Engineering', degree: 'B.Tech', duration: 4, seats: 90, exams: ['JEE Advanced', 'JEE Main'] },
        { name: 'Mechanical Engineering', degree: 'B.Tech', duration: 4, seats: 90, exams: ['JEE Advanced', 'JEE Main'] },
        { name: 'M.Tech Computer Science', degree: 'M.Tech', duration: 2, seats: 30, exams: ['GATE'] },
      ];
    }

    for (const course of courses) {
      await prisma.course.create({
        data: {
          collegeId: created.id,
          name: course.name,
          degree: course.degree,
          duration: course.duration,
          seats: course.seats,
          exams: course.exams,
          minFees: Math.round(college.minFees * 0.9),
          maxFees: college.maxFees,
        },
      });
    }

    const reviewTexts = [
      { title: 'World-class education', rating: 5, pros: 'Amazing faculty, great peer group', cons: 'Very competitive environment' },
      { title: 'Life-changing experience', rating: 4, pros: 'Great campus life, strong alumni network', cons: 'Limited practical exposure early on' },
      { title: 'Good but demanding', rating: 4, pros: 'Quality education, research opportunities', cons: 'Heavy course load' },
    ];

    for (let i = 0; i < 3; i++) {
      const r = reviewTexts[i];
      await prisma.review.create({
        data: {
          collegeId: created.id,
          userId: users[i % users.length].id,
          rating: r.rating,
          title: r.title,
          content: `This college has been an incredible journey. ${r.pros}. However, ${r.cons}. Overall highly recommended.`,
          pros: r.pros,
          cons: r.cons,
          batch: 2021 + i,
          program: isManagement ? 'MBA' : isMedical ? 'MBBS' : isArts ? 'BA' : 'B.Tech',
          helpful: Math.floor(Math.random() * 50),
        },
      });
    }
  }

  // Predictor data
  const predictorData = [
    { exam: 'JEE Main', minRank: 1, maxRank: 500, slug: 'iit-bombay', category: 'General' },
    { exam: 'JEE Main', minRank: 1, maxRank: 600, slug: 'iit-delhi', category: 'General' },
    { exam: 'JEE Main', minRank: 1, maxRank: 400, slug: 'iit-madras', category: 'General' },
    { exam: 'JEE Main', minRank: 500, maxRank: 3000, slug: 'nit-trichy', category: 'General' },
    { exam: 'JEE Main', minRank: 2000, maxRank: 15000, slug: 'bits-pilani', category: 'General' },
    { exam: 'JEE Main', minRank: 5000, maxRank: 50000, slug: 'vit-vellore', category: 'General' },
    { exam: 'JEE Main', minRank: 3000, maxRank: 25000, slug: 'manipal-institute-technology', category: 'General' },
    { exam: 'JEE Main', minRank: 1, maxRank: 1500, slug: 'iit-bombay', category: 'OBC' },
    { exam: 'JEE Main', minRank: 1, maxRank: 5000, slug: 'nit-trichy', category: 'OBC' },
    { exam: 'JEE Advanced', minRank: 1, maxRank: 100, slug: 'iit-bombay', category: 'General' },
    { exam: 'JEE Advanced', minRank: 1, maxRank: 120, slug: 'iit-delhi', category: 'General' },
    { exam: 'JEE Advanced', minRank: 1, maxRank: 80, slug: 'iit-madras', category: 'General' },
    { exam: 'NEET', minRank: 1, maxRank: 50, slug: 'aiims-delhi', category: 'General' },
    { exam: 'NEET', minRank: 1, maxRank: 200, slug: 'aiims-delhi', category: 'OBC' },
    { exam: 'CAT', minRank: 1, maxRank: 200, slug: 'iima', category: 'General' },
  ];

  for (const item of predictorData) {
    const college = createdColleges.find((c) => c.slug === item.slug);
    if (college) {
      await prisma.predictorResult.create({
        data: { exam: item.exam, minRank: item.minRank, maxRank: item.maxRank, collegeId: college.id, category: item.category },
      });
    }
  }

  // Questions
  const questions = [
    { title: 'What is the difference between IIT and NIT for B.Tech CSE?', content: 'I have secured a decent rank in JEE Main. Can someone explain the key differences between IITs and NITs for Computer Science?', tags: ['JEE', 'B.Tech', 'CSE', 'IIT', 'NIT'] },
    { title: 'Is BITS Pilani better than NIT Trichy for ECE?', content: 'I am confused between BITS Pilani ECE and NIT Trichy ECE. What are the placement scenarios at both?', tags: ['BITS', 'NIT', 'ECE', 'Placements'] },
    { title: 'How to prepare for CAT while doing B.Tech?', content: 'I am a 3rd year B.Tech student. I want to pursue MBA from IIM Ahmedabad. How should I balance academics and CAT prep?', tags: ['CAT', 'MBA', 'IIM', 'Preparation'] },
  ];

  for (let i = 0; i < questions.length; i++) {
    const q = await prisma.question.create({
      data: { ...questions[i], userId: users[i % users.length].id, views: Math.floor(Math.random() * 500) + 50 },
    });
    await prisma.answer.create({
      data: {
        questionId: q.id,
        userId: users[(i + 1) % users.length].id,
        content: 'Great question! Based on my experience, both options have their merits. Key factors to consider are placement records, fee structure, and your long-term career goals. I would suggest visiting official placement reports before deciding.',
        upvotes: Math.floor(Math.random() * 20),
        isAccepted: true,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`✅ Created ${createdColleges.length} colleges`);
  console.log('✅ Demo login: demo@example.com / password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());