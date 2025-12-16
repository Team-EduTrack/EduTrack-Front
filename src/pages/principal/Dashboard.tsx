import Table from "../../components/common/Table";
import Page from "../../components/common/Page";
import ViewMore from "../../components/ViewMore";
import { useRecoilValue } from "recoil";
import { authState } from "../../stores/authStore";
import { useSearchUsers } from "../../api/generated/edutrack";

export default function PrincipalDashBoard() {
  const auth = useRecoilValue(authState);
  const academyId = auth.user?.academy?.id;

  const { data: teachersRes } = useSearchUsers(academyId ?? 0, {
    role: "TEACHER",
  });

  const { data: studentsRes } = useSearchUsers(academyId ?? 0, {
    role: "STUDENT",
  });

  const teachersRaw = teachersRes?.data ?? [];
  const studentsRaw = studentsRes?.data ?? [];

  const teachers = teachersRaw.slice(0, 6).map((u, idx) => ({
    no: idx + 1,
    userId: u.id!,
    name: u.name ?? "-",
  }));

  const students = studentsRaw.slice(0, 6).map((u, idx) => ({
    no: idx + 1,
    userId: u.id!,
    name: u.name ?? "-",
  }));

  if (!academyId) {
    return (
      <Page>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10">
          학원 정보가 없습니다.
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            {/* 왼쪽 텍스트 영역 */}
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
                {auth.user?.academy?.name}
              </h2>

              <p className="text-lg font-medium text-gray-800">
                {auth.user?.name}원장님, 환영합니다 👋
              </p>

              <p className="text-gray-600 leading-relaxed max-w-md">
                학원 운영 정보를 한눈에 확인해보세요.
              </p>
            </div>

            {/* 오른쪽 정보 박스 */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 min-w-[200px]">
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600">아이디</p>
                <p className="text-lg font-bold text-gray-800 mb-2">
                  {auth.user?.loginId}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">학원 코드</p>
                <p className="text-lg font-bold text-gray-800">
                  {auth.user?.academy?.code}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 강사 리스트 */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                강사 리스트
              </h3>
              <ViewMore to="/principal/users" />
            </div>

            <Table
              columns={[
                {
                  header: "NO",
                  accessor: "no",
                  className: "text-center w-40",
                },
                {
                  header: "이름",
                  accessor: "name",
                  className: "text-center pl-4",
                },
              ]}
              data={teachers}
              keyExtractor={(row) => row.userId}
              emptyMessage="강사 정보가 없습니다."
            />
          </div>

          {/* 학생 리스트 */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                학생 리스트
              </h3>
              <ViewMore to="/principal/users" />
            </div>

            <Table
              columns={[
                {
                  header: "NO",
                  accessor: "no",
                  className: "text-center w-40",
                },
                {
                  header: "이름",
                  accessor: "name",
                  className: "text-center pl-4",
                },
              ]}
              data={students}
              keyExtractor={(row) => row.userId}
              emptyMessage="학생 정보가 없습니다."
            />
          </div>
        </div>
      </div>
    </Page>
  );
}
