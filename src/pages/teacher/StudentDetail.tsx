import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import { authState } from "../../stores/authStore";
import { useSearchUsers } from "../../api/generated/edutrack";
import { useTeacherLectures } from "../../hooks/teacher";

export default function StudentDetail() {
  const { studentId } = useParams<{ studentId: string }>();
  const studentIdNum = Number(studentId);
  const auth = useRecoilValue(authState);
  const academyId = auth.user?.academy?.id ?? 0;

  // 학생 정보 검색
  const { data: usersData, isLoading: isLoadingUsers } = useSearchUsers(
    academyId,
    { role: "STUDENT" },
    {
      query: {
        enabled: !!academyId,
      },
    }
  );

  // 강의 목록 조회
  const { lectures, isLoading: isLoadingLectures } = useTeacherLectures();

  const isLoading = isLoadingUsers || isLoadingLectures;
  const users = usersData?.data ?? [];
  const student = users.find((u) => u.id === studentIdNum);

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Page>
    );
  }

  if (!student) {
    return (
      <Page>
        <Card>
          <p className="text-red-500">학생 정보를 찾을 수 없습니다.</p>
        </Card>
      </Page>
    );
  }

  // 학생이 수강 중인 강의 필터링 (강의 상세에서 학생 목록 확인 필요하지만 현재는 간단히 표시)
  const studentLectures = lectures; // 실제로는 학생이 수강 중인 강의만 필터링 필요

  return (
    <Page>
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">학생 프로필</h2>
          <Card>
            <div className="flex gap-6">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
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
              </div>
              <div className="flex flex-col justify-center gap-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">이름 : </span>
                  {student.name ?? "-"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">아이디 : </span>
                  {student.loginId ?? "-"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">전화번호 : </span>
                  {student.phone ?? "-"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">역할 : </span>
                  {student.role ?? "-"}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">수강중인 강의</h2>
          <Card>
            {studentLectures.length === 0 ? (
              <p className="text-sm text-gray-500">수강중인 강의가 없습니다.</p>
            ) : (
              <Table
                columns={[
                  {
                    header: "",
                    accessor: (_, index) => index + 1,
                    className: "w-16 text-center",
                  },
                  {
                    header: "강의명",
                    accessor: (lecture) => lecture.title ?? "-",
                  },
                  {
                    header: "수강생 수",
                    accessor: (lecture) => `${lecture.studentCount ?? 0}명`,
                  },
                ]}
                data={studentLectures}
                keyExtractor={(lecture) => lecture.lectureId!}
                emptyMessage="수강중인 강의가 없습니다."
              />
            )}
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">학생 분석</h2>
          <Card>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                학생 개별 분석 기능은 현재 API에서 본인만 조회 가능합니다.
                <br />
                강사용 학생 분석 API가 추가되면 이 기능을 사용할 수 있습니다.
              </p>
            </div>
          </Card>
        </section>
      </div>
    </Page>
  );
}
