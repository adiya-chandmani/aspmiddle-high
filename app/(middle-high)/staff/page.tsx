import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";

export const metadata = {
  title: "University Acceptances & Matriculation | School Web Platform",
  description: "University acceptances and matriculation outcomes",
};

export default function UniversityAcceptancesPage() {
  return (
    <MiddleHighHeroLayout active="acceptances">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">University Acceptances &amp; Matriculation</h1>
          <p className="text-gray-600 mt-2">
            Highlights of university acceptances and matriculation outcomes.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-3">Coming soon</h2>
          <p className="text-gray-700">
            Add your annual results, destination list, and summary statistics here.
          </p>
        </div>
      </div>
    </MiddleHighHeroLayout>
  );
}


