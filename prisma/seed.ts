import { PrismaClient, NewsCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables.');
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Seed Admin
  const adminEmail = "admin@padmashreecollege.edu.np";
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("PadmashreeAdmin123!", 10);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Padmashree Admin",
      }
    });
  }

  // 2. Seed Programs
  const programs = [
    {
      code: "BIT",
      name: "BIT",
      fullName: "Bachelor of Information Technology",
      duration: "4 Years",
      description: "Padmashree College offers a world-class Bachelor of Information Technology (BIT) program designed to deliver a comprehensive foundation in modern software development, data administration, and networking interfaces.",
      highlights: ["No entrance exam", "Industry-ready curriculum", "Software & networking focus"],
      affiliatedWith: "Nilai University, Malaysia",
      slug: "bit-bachelor-of-information-technology"
    },
    {
      code: "BHM",
      name: "BHM",
      fullName: "Bachelor of Hotel Management",
      duration: "4 Years",
      description: "Our Bachelor of Hotel Management (BHM) prepares students for rapid placement in the global hospitality sector. The course combines practical operations management with corporate administrative models.",
      highlights: ["International internships", "Nilai University affiliated", "Global placement support"],
      affiliatedWith: "Nilai University, Malaysia",
      slug: "bhm-bachelor-of-hotel-management"
    },
    {
      code: "BBA",
      name: "BBA",
      fullName: "Bachelor of Business Administration",
      duration: "4 Years",
      description: "The Bachelor of Business Administration (BBA) at Padmashree College equips future corporate leaders with core competencies in digital marketing, financial management, entrepreneurship, and strategy.",
      highlights: ["Entrepreneurship focus", "Live business projects", "Industry mentorship"],
      affiliatedWith: "Nilai University, Malaysia",
      slug: "bba-bachelor-of-business-administration"
    },
    {
      code: "BCA",
      name: "BCA",
      fullName: "Bachelor of Computer Applications",
      duration: "4 Years",
      description: "The Bachelor of Computer Applications (BCA) focuses on programming principles, web applications, and database administration with a highly structured local relevance and project-centered learning cycles.",
      highlights: ["TU affiliated", "Programming & databases", "Project-based learning models"],
      affiliatedWith: "Tribhuvan University",
      slug: "bca-bachelor-of-computer-applications"
    },
    {
      code: "BTECH",
      name: "B.Tech Food",
      fullName: "Bachelor of Food Technology",
      duration: "4 Years",
      description: "The Bachelor of Food Technology (B.Tech Food) program offers deep academic research alongside experimental laboratory training in food processing, nutrition chemistry, and industrial quality control.",
      highlights: ["Advanced science labs", "Industry partnerships", "Research opportunities"],
      affiliatedWith: "Tribhuvan University",
      slug: "btech-food-technology"
    }
  ];

  for (const prog of programs) {
    await prisma.program.upsert({
      where: { code: prog.code },
      update: prog,
      create: prog,
    });
  }

  // 3. Seed Testimonials
  const testimonials = [
    {
      name: "Ushna Khadka",
      initials: "UK",
      program: "BABHM",
      quote: "The hands-on practice in high-end culinary labs allowed me to confidently secure a direct international internship at Dubai's luxury hotel.",
      published: true,
      order: 1
    },
    {
      name: "Srijan Thapa",
      initials: "ST",
      program: "BABHM",
      quote: "Padmashree offers brilliant mentors who push boundaries. The environment is extremely collaborative, matching real-world scenarios.",
      published: true,
      order: 2
    },
    {
      name: "Binita Subedi",
      initials: "BS",
      program: "B.Tech Food",
      quote: "The food tech labs are outstanding. Under the guidance of research mentors, I transitioned directly into a government research post.",
      published: true,
      order: 3
    },
    {
      name: "Bishrut Rajbhandari",
      initials: "BR",
      program: "BIT",
      quote: "Studying IT at Padmashree helped me gain practical experience early. No entrance exam restrictions helped me focus on direct coding skills.",
      published: true,
      order: 4
    }
  ];

  await prisma.testimonial.deleteMany();
  for (const test of testimonials) {
    await prisma.testimonial.create({ data: test });
  }

  // 4. Seed News
  const newsItems = [
    {
      title: "Admissions Open for Academic Year 2027",
      slug: "admissions-open-academic-year-2027",
      content: "<p>Padmashree College is proud to announce admissions open for the 2027 academic batch. Join our prestigious BIT, BCA, BBA, BHM, and B.Tech Food courses affiliated with Tribhuvan University and Nilai University, Malaysia.</p><p>We focus on quality, professional infrastructure, and industry placement.</p>",
      excerpt: "Padmashree College announces admissions open for the upcoming 2027 academic year across all major courses.",
      coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800",
      category: NewsCategory.ANNOUNCEMENT,
      published: true,
    },
    {
      title: "Annual Tech Innovation and Food Exhibition 2026",
      slug: "annual-tech-innovation-food-exhibition-2026",
      content: "<p>Join us for the grand annual exhibition where our BIT and Food Tech students demonstrate live research models, hardware setups, and food quality systems. The event is open to parents, alumni, and industry delegates.</p>",
      excerpt: "Experience cutting edge IT solutions and food technology models developed by our brilliant students.",
      coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800",
      category: NewsCategory.EVENT,
      eventDate: new Date("2026-07-15T10:00:00Z"),
      published: true,
    },
    {
      title: "Nilai University MOU Renewal Ceremony",
      slug: "nilai-university-mou-renewal-ceremony",
      content: "<p>We have successfully renewed our corporate partnership with Nilai University, Malaysia, guaranteeing continued international pathways, credit transfer facilities, and direct internships for BIT, BBA, and BHM students.</p>",
      excerpt: "Padmashree College strengthens global affiliation by renewing its pathway agreement with Nilai University.",
      coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800",
      category: NewsCategory.ANNOUNCEMENT,
      published: true,
    }
  ];

  await prisma.news.deleteMany();
  for (const news of newsItems) {
    await prisma.news.create({ data: news });
  }

  // 5. Seed Events (Prisma original event model)
  const events = [
    {
      title: "Bagmati Cleaning Campaign",
      description: "A community clean-up drive organized by the student council to preserve the environment.",
      category: "Community",
      eventDate: new Date("2026-11-15T09:00:00Z"),
      published: true
    },
    {
      title: "Intra-College Futsal Tournament",
      description: "The annual sports meet with intense matches among various semester groups.",
      category: "Sports",
      eventDate: new Date("2026-11-20T10:00:00Z"),
      published: true
    }
  ];

  await prisma.event.deleteMany();
  for (const ev of events) {
    await prisma.event.create({ data: ev });
  }

  // 6. Seed Gallery Albums & Photos
  await prisma.galleryAlbum.deleteMany();
  
  const album1 = await prisma.galleryAlbum.create({
    data: {
      title: "Campus Infrastructure",
      description: "Explore the classrooms, lecture halls, and common spaces at Padmashree College.",
      coverImage: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800",
      photos: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?q=80&w=800",
            caption: "Library and Reading Room",
            order: 0,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800",
            caption: "Main College Building",
            order: 1,
          }
        ]
      }
    }
  });

  const album2 = await prisma.galleryAlbum.create({
    data: {
      title: "Advanced Laboratories",
      description: "Step inside our state-of-the-art computer networks and culinary labs.",
      coverImage: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=800",
      photos: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800",
            caption: "Modern Computer Lab",
            order: 0,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800",
            caption: "BHM Training Kitchen",
            order: 1,
          }
        ]
      }
    }
  });

  // 7. Seed Settings
  const settings = [
    { key: "college_name", value: "Padmashree College" },
    { key: "address", value: "Tinkune, Kathmandu, Nepal" },
    { key: "phone", value: "+977 1-4112252, 4112403" },
    { key: "email", value: "info@padmashreecollege.edu.np" },
    { key: "facebook_url", value: "https://facebook.com/padmashree" },
    { key: "linkedin_url", value: "https://linkedin.com/school/padmashree" },
    { key: "twitter_url", value: "https://twitter.com/padmashree" },
    { key: "youtube_url", value: "https://youtube.com/padmashree" },
    { key: "tiktok_url", value: "https://tiktok.com/@padmashree" }
  ];

  for (const set of settings) {
    await prisma.siteSetting.upsert({
      where: { key: set.key },
      update: set,
      create: set
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
