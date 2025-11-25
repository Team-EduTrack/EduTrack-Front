import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import ScoreBox from "../../components/common/ScoreBox";

const mockStudent = {
  id: 1,
  name: "김민준",
  phone: "010-1234-5678",
  profileImage: null,
};

const mockLectures = [
  { id: 1, name: "재미있는 영어", teacher: "박선영", attendanceRate: "92%" },
  { id: 2, name: "보카 독파", teacher: "이정훈", attendanceRate: "85%" },
];

const mockExamScores = [
  { id: 1, lectureName: "재미있는 영어", score: 87, total: 100 },
  { id: 2, lectureName: "영문법 특강", score: 92, total: 100 },
  { id: 3, lectureName: "보카 독파", score: 78, total: 100 },
];

export default function StudentDetail() {
  return (
    <Page>
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">학생 프로필</h2>
          <Card>
            <div className="flex gap-6">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {mockStudent.profileImage ? (
                  <img
                    src={mockStudent.profileImage}
                    alt={mockStudent.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <div className="flex flex-col justify-center gap-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">이름 : </span>
                  {mockStudent.name}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">전화번호 : </span>
                  {mockStudent.phone}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">수강중인 강의</h2>
          <Card>
            <Table
              columns={[
                {
                  header: "",
                  accessor: (_, index) => index + 1,
                  className: "w-16 text-center",
                },
                { header: "강의명", accessor: "name" },
                { header: "강사명", accessor: "teacher" },
                { header: "출석률", accessor: "attendanceRate" },
              ]}
              data={mockLectures}
              keyExtractor={(lecture) => lecture.id}
              emptyMessage="수강중인 강의가 없습니다."
            />
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">시험 성적</h2>
          <Card>
            <div className="grid grid-cols-2 gap-4">
              {mockExamScores.map((exam) => (
                <ScoreBox
                  key={exam.id}
                  label={exam.lectureName}
                  value={`${exam.score} / ${exam.total}`}
                />
              ))}
            </div>
          </Card>
        </section>
      </div>
    </Page>
  );
}
