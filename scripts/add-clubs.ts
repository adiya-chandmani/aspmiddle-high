import { prisma } from "../lib/db";

const clubs = [
  {
    title: "AMC 8",
    section: "AMC 8",
    summary: "American Mathematics Competitions 8",
    content: "<p>AMC 8 동아리에 오신 것을 환영합니다.</p>",
    order: 0,
    isActive: true,
  },
  {
    title: "Biology",
    section: "Biology",
    summary: "생물학 동아리",
    content: "<p>Biology 동아리에 오신 것을 환영합니다.</p>",
    order: 0,
    isActive: true,
  },
  {
    title: "Model UN",
    section: "Model UN",
    summary: "모의 유엔 동아리",
    content: "<p>Model UN 동아리에 오신 것을 환영합니다.</p>",
    order: 0,
    isActive: true,
  },
  {
    title: "Public Speaking",
    section: "Public Speaking",
    summary: "공개 연설 동아리",
    content: "<p>Public Speaking 동아리에 오신 것을 환영합니다.</p>",
    order: 0,
    isActive: true,
  },
  {
    title: "HSK 3rd",
    section: "HSK 3rd",
    summary: "HSK 3급 준비 동아리",
    content: "<p>HSK 3rd 동아리에 오신 것을 환영합니다.</p>",
    order: 0,
    isActive: true,
  },
  {
    title: "Code Combat",
    section: "Code Combat",
    summary: "코딩 전투 동아리",
    content: "<p>Code Combat 동아리에 오신 것을 환영합니다.</p>",
    order: 0,
    isActive: true,
  },
  {
    title: "Student Government",
    section: "Student Government",
    summary: "학생 자치회",
    content: "<p>Student Government에 오신 것을 환영합니다.</p>",
    order: 0,
    isActive: true,
  },
  {
    title: "Sat Math",
    section: "Sat Math",
    summary: "SAT 수학 준비 동아리",
    content: "<p>Sat Math 동아리에 오신 것을 환영합니다.</p>",
    order: 0,
    isActive: true,
  },
  {
    title: "NHS",
    section: "NHS",
    summary: "National Honor Society",
    content: "<p>NHS에 오신 것을 환영합니다.</p>",
    order: 0,
    isActive: true,
  },
  {
    title: "Study Hall",
    section: "Study Hall",
    summary: "자습실",
    content: "<p>Study Hall에 오신 것을 환영합니다.</p>",
    order: 0,
    isActive: true,
  },
];

async function main() {
  console.log("클럽 추가를 시작합니다...");

  for (const club of clubs) {
    // 이미 존재하는지 확인
    const existing = await prisma.clubArticle.findFirst({
      where: {
        section: club.section,
        title: club.title,
      },
    });

    if (existing) {
      console.log(`✓ "${club.title}" (${club.section}) 이미 존재합니다. 건너뜁니다.`);
      continue;
    }

    try {
      await prisma.clubArticle.create({
        data: club,
      });
      console.log(`✓ "${club.title}" (${club.section}) 추가 완료`);
    } catch (error) {
      console.error(`✗ "${club.title}" (${club.section}) 추가 실패:`, error);
    }
  }

  console.log("\n클럽 추가 작업이 완료되었습니다.");
}

main()
  .catch((e) => {
    console.error("오류 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

