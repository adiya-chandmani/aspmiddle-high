import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";
import { prisma } from "@/lib/db";
import Image from "next/image";

export const metadata = {
  title: "Teachers | School Web Platform",
  description: "Faculty Introduction",
};

// 동적 렌더링 강제 (캐시 방지)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeachersPage() {
  const teachers = await prisma.teacher.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <MiddleHighHeroLayout active="teachers">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Teachers</h1>
        </div>

        {/* Teachers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                {teacher.profileImage ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-gray-200">
                    <Image
                      src={teacher.profileImage}
                      alt={teacher.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-white">
                      {teacher.name[0]?.toUpperCase() || "T"}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-center text-gray-900">
                  {teacher.name}
                </h3>
                {teacher.subject && (
                  <p className="text-center text-orange font-medium mt-1">
                    {teacher.subject}
                  </p>
                )}
              </div>
              <div className="text-center">
                {teacher.email && (
                  <p className="text-sm text-gray-600 mb-2">{teacher.email}</p>
                )}
                {teacher.bio && (
                  <p className="text-sm text-gray-700">{teacher.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {teachers.length === 0 && (
          <div className="bg-gray-50 p-12 rounded-lg text-center">
            <p className="text-lg text-gray-600">
              No faculty information has been registered yet.
            </p>
          </div>
        )}
      </div>
    </MiddleHighHeroLayout>
  );
}

