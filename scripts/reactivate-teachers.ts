import { prisma } from "../lib/db";

async function reactivateTeachers() {
  console.log("=== Reactivating All Teachers ===\n");

  // 모든 비활성화된 teacher를 활성화
  const result = await prisma.teacher.updateMany({
    where: {
      isActive: false,
    },
    data: {
      isActive: true,
    },
  });

  console.log(`✓ Reactivated ${result.count} teachers\n`);

  // 확인
  const activeTeachers = await prisma.teacher.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  console.log("Active Teachers:");
  activeTeachers.forEach((teacher) => {
    console.log(`  - ${teacher.name} (${teacher.subject || "No subject"})`);
  });

  await prisma.$disconnect();
}

reactivateTeachers().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});

