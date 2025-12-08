import { prisma } from "../lib/db";

async function checkTeachers() {
  console.log("=== Teachers Database Check ===\n");

  // 모든 teacher 조회
  const allTeachers = await prisma.teacher.findMany({
    orderBy: [
      { isActive: "desc" },
      { createdAt: "desc" },
    ],
  });

  console.log(`Total Teachers: ${allTeachers.length}\n`);

  // 활성화된 teacher
  const activeTeachers = allTeachers.filter((t) => t.isActive);
  console.log(`Active Teachers: ${activeTeachers.length}`);
  
  // 비활성화된 teacher
  const inactiveTeachers = allTeachers.filter((t) => !t.isActive);
  console.log(`Inactive Teachers: ${inactiveTeachers.length}\n`);

  console.log("=== All Teachers ===");
  allTeachers.forEach((teacher, index) => {
    console.log(`\n${index + 1}. ${teacher.name}`);
    console.log(`   ID: ${teacher.id}`);
    console.log(`   User ID: ${teacher.userId}`);
    console.log(`   Active: ${teacher.isActive}`);
    console.log(`   Subject: ${teacher.subject || "N/A"}`);
    console.log(`   Email: ${teacher.email || "N/A"}`);
    console.log(`   Created: ${teacher.createdAt}`);
    console.log(`   Updated: ${teacher.updatedAt}`);
  });

  // userId 중복 확인
  const userIds = allTeachers.map((t) => t.userId);
  const uniqueUserIds = new Set(userIds);
  
  if (userIds.length !== uniqueUserIds.size) {
    console.log("\n⚠️  WARNING: Duplicate userIds found!");
    const duplicates = userIds.filter((id, index) => userIds.indexOf(id) !== index);
    console.log("Duplicate userIds:", duplicates);
  } else {
    console.log("\n✓ No duplicate userIds");
  }

  await prisma.$disconnect();
}

checkTeachers().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});

