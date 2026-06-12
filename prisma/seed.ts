import { PrismaClient } from '@prisma/client';
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
  const adminEmail = "admin@padmashreecollege.edu.np";
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Padmashree Admin",
      }
    });
  }

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
    },
    {
      name: "Saneep Shrestha",
      initials: "SS",
      program: "BABHM",
      quote: "The curriculum keeps up with international standards, helping us prepare for jobs in the international market from day one.",
      published: true,
      order: 5
    },
    {
      name: "Sushil Thapa Magar",
      initials: "SM",
      program: "BABHM",
      quote: "Padmashree is like a second home. The dynamic student community, sports leagues, and continuous encouragement shaped my leadership traits.",
      published: true,
      order: 6
    }
  ];

  await prisma.testimonial.deleteMany();
  for (const test of testimonials) {
    await prisma.testimonial.create({ data: test });
  }

  const newsItems = [
    {
      title: "Admission Open 2083 — No Entrance Exam for BIT",
      slug: "admission-open-2083-no-entrance-exam-for-bit",
      excerpt: "Padmashree College announces admissions open for the 2083 batch. Learn about our flexible BIT intake paths.",
      content: "We are excited to announce that admission is now open for the 2083 academic session. Following modern learning standards, the BIT program does not require an entrance exam, enabling candidates with coding passion to apply directly based on their academic qualifications.",
      category: "Admissions",
      published: true
    },
    {
      title: "Final Exam Timetable July 2026 Published",
      slug: "final-exam-timetable-july-2026-published",
      excerpt: "The exam schedules for July 2026 have been published for all departments. Check yours now.",
      content: "All students are notified that the final examinations for the semester starting July 2026 will commence on July 10, 2026. Detail sheets are available at the administration office and down on the student portal downloads page.",
      category: "Academic",
      published: true
    },
    {
      title: "Annual Journal of Technology Innovation Released",
      slug: "annual-journal-of-technology-innovation-released",
      excerpt: "The latest volume of technology innovation and food science research is now available in the library.",
      content: "Our academic committee has officially released the fifth volume of the Padmashree Research Journal, showcasing articles in cloud computing, modern hospitality service layouts, and food technology innovation.",
      category: "Research",
      published: true
    },
    {
      title: "B.Tech Food Second Semester Classes Commence",
      slug: "btech-food-second-semester-classes-commence",
      excerpt: "Second-semester classes for Food Technology will begin next week. Read for class logs.",
      content: "All B.Tech Food students of the second semester are requested to note that classes will start on Monday. The new laboratory schedules and thesis group divisions have been updated on the notice board.",
      category: "Academic",
      published: true
    },
    {
      title: "Thesis Defense Scheduled for Final Year Candidates",
      slug: "thesis-defense-scheduled-final-year",
      excerpt: "Final year IT and Food Science candidates must submit draft copies before June 25.",
      content: "The academic board has scheduled final thesis defense schedules from June 28 to June 30. Ensure all external mentor sign-offs are completed before submitting the bound copies to the department head.",
      category: "Academic",
      published: true
    },
    {
      title: "Mid Term Examination Schedule Announced",
      slug: "mid-term-exam-schedule-announced",
      excerpt: "Mid-term evaluations begin mid-next month. Prepare accordingly.",
      content: "The mid-term assessments for all programs will run for one week starting from the 15th of next month. Attendance criteria of 75% is strictly mandatory to appear in evaluations.",
      category: "Academic",
      published: true
    }
  ];

  await prisma.news.deleteMany();
  for (const news of newsItems) {
    await prisma.news.create({ data: news });
  }

  const events = [
    {
      title: "Bagmati Cleaning Campaign",
      description: "A community clean-up drive organized by the student council to preserve the environment.",
      category: "Community",
      eventDate: new Date("2024-11-15T09:00:00Z"),
      published: true
    },
    {
      title: "Intra-College Futsal Tournament",
      description: "The annual sports meet with intense matches among various semester groups.",
      category: "Sports",
      eventDate: new Date("2024-11-20T10:00:00Z"),
      published: true
    },
    {
      title: "The Alpha's Presents Workshop",
      description: "An intensive coding and web technologies workshop led by senior software developers.",
      category: "Academic",
      eventDate: new Date("2024-11-25T13:00:00Z"),
      published: true
    },
    {
      title: "Food Safety & Labelling Program",
      description: "A research-focused session demonstrating practical guidelines for nutrition control.",
      category: "Academic",
      eventDate: new Date("2023-10-12T11:00:00Z"),
      published: true
    },
    {
      title: "CO-OP Program with eSewa",
      description: "Signing and orientation ceremony for our cooperative intern placement scheme with eSewa.",
      category: "Academic",
      eventDate: new Date("2023-09-05T10:00:00Z"),
      published: true
    },
    {
      title: "Project Sahara Clean Drive",
      description: "Social outreach and cleaning campaign led by the students of BHM and BBA.",
      category: "Community",
      eventDate: new Date("2024-11-30T09:00:00Z"),
      published: true
    }
  ];

  await prisma.event.deleteMany();
  for (const ev of events) {
    await prisma.event.create({ data: ev });
  }

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
