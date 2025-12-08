import MiddleHighHeroLayout from "@/components/layouts/MiddleHighHeroLayout";

export const metadata = {
  title: "Student Life | School Web Platform",
  description: "학생 생활, 학사 일정, 공지사항, 이벤트",
};

export default function StudentLifePage() {
  return (
    <MiddleHighHeroLayout active="about">
      <div className="container mx-auto px-4 py-12">
      {/* Academic Calendar */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-8">Academic Calendar</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-navy-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">1학기</h3>
              <p className="text-gray-600">3월 - 7월</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">여름 방학</h3>
              <p className="text-gray-600">7월 - 8월</p>
            </div>
            <div className="text-center p-4 bg-navy-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">2학기</h3>
              <p className="text-gray-600">9월 - 12월</p>
            </div>
          </div>
          <p className="text-gray-600 mt-6 text-center">
            자세한 학사 일정은 학교 공지사항을 확인해주세요.
          </p>
        </div>
      </section>

      {/* Announcements */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Announcements</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    공지사항 제목 {i}
                  </h3>
                  <p className="text-gray-600">
                    공지사항 내용이 여기에 표시됩니다. 자세한 내용은 클릭하여 확인하세요.
                  </p>
                </div>
                <span className="text-sm text-gray-500">2025.01.01</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Documents & Forms */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Documents & Forms</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3">결석계</h3>
            <p className="text-gray-600 mb-4">
              결석 사유를 기재하여 제출하는 양식입니다.
            </p>
            <a
              href="#"
              className="text-navy hover:text-navy-700 font-medium"
            >
              다운로드 →
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3">외출 신청서</h3>
            <p className="text-gray-600 mb-4">
              수업 중 외출이 필요한 경우 작성하는 양식입니다.
            </p>
            <a
              href="#"
              className="text-navy hover:text-navy-700 font-medium"
            >
              다운로드 →
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3">체험학습 신청서</h3>
            <p className="text-gray-600 mb-4">
              체험학습 참가를 위한 신청 양식입니다.
            </p>
            <a
              href="#"
              className="text-navy hover:text-navy-700 font-medium"
            >
              다운로드 →
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3">기타 양식</h3>
            <p className="text-gray-600 mb-4">
              기타 필요한 양식들을 확인할 수 있습니다.
            </p>
            <a
              href="#"
              className="text-navy hover:text-navy-700 font-medium"
            >
              더보기 →
            </a>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Events</h2>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-lg text-gray-600 mb-4">
            현재 예정된 이벤트가 없습니다.
          </p>
          <p className="text-gray-500">
            새로운 이벤트가 등록되면 여기에 표시됩니다.
          </p>
        </div>
      </section>
      </div>
    </MiddleHighHeroLayout>
  );
}

