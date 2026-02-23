import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";
import { prisma } from "@/lib/db";
import Image from "next/image";
import BioText from "./BioText";

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
        {person.email && <p className="text-sm text-gray-600 mb-3">{person.email}</p>}

        {person.bio && <BioText text={person.bio} clampLines={5} />}
      </div>
    </div>
  );
}

export default async function FacultyStaffPage({
  searchParams,
}: {
  searchParams?: { section?: string };
}) {
  const sectionParam = (searchParams?.section || "faculty").toLowerCase();
  const activeSection: "faculty" | "staff" = sectionParam === "staff" ? "staff" : "faculty";

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

  const list = activeSection === "faculty" ? faculty : staff;

  return (
    <MiddleHighHeroLayout active="facultyStaff">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold">Faculty &amp; Staff</h1>

          {/* Section Toggle */}
          <div className="flex gap-2">
            <a
              href="/teachers?section=faculty"
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                activeSection === "faculty"
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-gray-800 border-gray-200 hover:border-orange"
              }`}
            >
              Faculty
            </a>
            <a
              href="/teachers?section=staff"
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                activeSection === "staff"
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-gray-800 border-gray-200 hover:border-orange"
              }`}
            >
              Staff
            </a>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-6">
            {activeSection === "faculty" ? "Faculty" : "Staff"}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((person) => (
              <div key={person.id}>
                <PersonCard
                  person={person}
                  fallbackLetter={activeSection === "faculty" ? "F" : "S"}
                />
              </div>
            ))}
          </div>

          {list.length === 0 && (
            <div className="bg-gray-50 p-10 rounded-lg text-center mt-6">
              <p className="text-lg text-gray-600">
                {activeSection === "faculty"
                  ? "No faculty information has been registered yet."
                  : "No staff information has been registered yet."}
              </p>
            </div>
          )}
        </section>
      </div>
    </MiddleHighHeroLayout>
  );
}

