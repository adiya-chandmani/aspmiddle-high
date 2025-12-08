/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Vercel Postgres에서 생성된 POSTGRES_URL을 DATABASE_URL로 매핑
    // Prisma는 DATABASE_URL을 사용하므로 이를 설정해야 함
    DATABASE_URL: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  },
};

export default nextConfig;

