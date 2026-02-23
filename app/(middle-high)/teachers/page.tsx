import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";
import { prisma } from "@/lib/db";
import Image from "next/image";

export const metadata = {
  title: "Faculty & Staff | School Web Platform",
  description: "Faculty and Staff Introduction",
};

// 동적 렌더링 강제 (캐시 방지)
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Person = {
  id: string;
  name: string;
  subject: string | null;
  email: string | null;
  bio: string | null;
  profileImage: string | null;
};

function PersonCard({ person, fallbackLetter }: { person: Person; fallbackLetter: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="mb-4">
        {person.profileImage ? (
          <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-gray-200">
            <Image
              src={person.profileImage}
              alt={person.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-white">
              {person.name[0]?.toUpperCase() || fallbackLetter}
            </span>
          </div>
        )}
        <h3 className="text-xl font-semibold text-center text-gray-900">
          {person.name}
        </h3>
        {person.subject && (
          <p className="text-center text-orange font-medium mt-1">{person.subject}</p>
        )}
      </div>
      <div className="text-center">
        {person.email && <p className="text-sm text-gray-600 mb-2">{person.email}</p>}
        {person.bio && <p className="text-sm text-gray-700">{person.bio}</p>}
      </div>
    </div>
  );
}

export default async function FacultyStaffPage() {
  const [faculty, staff] = await Promise.all([
    prisma.teacher.findMany({
      where: { isActive: true, type: "TEACHER" },
      orderBy: { name: "asc" },
    }),
    prisma.teacher.findMany({
      where: { isActive: true, type: "STAFF" },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <MiddleHighHeroLayout active="facultyStaff">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Faculty &amp; Staff</h1>
        </div>

        {/* Faculty Section */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6">Faculty</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.map((person) => (
              <div key={person.id}>
                <PersonCard person={person} fallbackLetter="F" />
              </div>
            ))}
          </div>

          {faculty.length === 0 && (
            <div className="bg-gray-50 p-10 rounded-lg text-center mt-6">
              <p className="text-lg text-gray-600">
                No faculty information has been registered yet.
              </p>
            </div>
          )}
        </section>

        {/* Staff Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Staff</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((person) => (
              <div key={person.id}>
                <PersonCard person={person} fallbackLetter="S" />
              </div>
            ))}
          </div>

          {staff.length === 0 && (
            <div className="bg-gray-50 p-10 rounded-lg text-center mt-6">
              <p className="text-lg text-gray-600">
                No staff information has been registered yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </MiddleHighHeroLayout>
  );
}

