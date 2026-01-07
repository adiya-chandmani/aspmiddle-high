import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";
import { prisma } from "@/lib/db";
import Image from "next/image";

export const metadata = {
  title: "Staff | School Web Platform",
  description: "Staff Introduction",
};

// 동적 렌더링 강제 (캐시 방지)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StaffPage() {
  const staff = await prisma.teacher.findMany({
    where: {
      isActive: true,
      type: "STAFF",
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <MiddleHighHeroLayout active="staff">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Staff</h1>
        </div>

        {/* Staff Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <div
              key={member.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                {member.profileImage ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-gray-200">
                    <Image
                      src={member.profileImage}
                      alt={member.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-white">
                      {member.name[0]?.toUpperCase() || "S"}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-center text-gray-900">
                  {member.name}
                </h3>
                {member.subject && (
                  <p className="text-center text-orange font-medium mt-1">
                    {member.subject}
                  </p>
                )}
              </div>
              <div className="text-center">
                {member.email && (
                  <p className="text-sm text-gray-600 mb-2">{member.email}</p>
                )}
                {member.bio && (
                  <p className="text-sm text-gray-700">{member.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {staff.length === 0 && (
          <div className="bg-gray-50 p-12 rounded-lg text-center">
            <p className="text-lg text-gray-600">
              No staff information has been registered yet.
            </p>
          </div>
        )}
      </div>
    </MiddleHighHeroLayout>
  );
}


