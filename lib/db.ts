import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Vercel Postgres는 POSTGRES_URL을 생성하므로 이를 DATABASE_URL로 사용
// 환경 변수 우선순위: DATABASE_URL > POSTGRES_URL
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL 또는 POSTGRES_URL 환경 변수가 설정되지 않았습니다."
  );
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

