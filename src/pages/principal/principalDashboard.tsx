import { useState } from "react";
import Table from "../../components/common/Table";

export default function PrincipalDashBoard() {
  // 추후 API로 교체
  const academyInfo = {
    academyName: "대성 학원",
    principalName: "김아무개",
    userId: "hayeon0513",
    academyCode: "EDU-1234",
  };
  const [teachers, setTeachers] = useState([
    { id: 1, name: "고지은", subject: "영어" },
    { id: 2, name: "김려리", subject: "국어" },
    { id: 3, name: "나윤서", subject: "사회" },
    { id: 4, name: "도한우", subject: "과학" },
    { id: 5, name: "라민지", subject: "수학" },
    { id: 6, name: "마서현", subject: "국어" },
  ]);

  const [students, setStudents] = useState([
    { id: 1, name: "박이안" },
    { id: 2, name: "배지안" },
    { id: 3, name: "서우진" },
    { id: 4, name: "손다혜" },
    { id: 5, name: "송예린" },
    { id: 6, name: "신아율" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            {/* 왼쪽 텍스트 영역 */}
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
                {academyInfo.academyName}
              </h2>

              <p className="text-lg font-medium text-gray-800">
                {academyInfo.principalName}원장님, 환영합니다 👋
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
                  {academyInfo.userId}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">학원 코드</p>
                <p className="text-lg font-bold text-gray-800">
                  {academyInfo.academyCode}
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
              <button className="text-sm text-primary hover:underline">
                더보기 &gt;
              </button>
            </div>

            <Table
              columns={[
                { header: "NO", accessor: "id", className: "text-center" },
                {
                  header: "이름",
                  accessor: "name",
                  className: "text-center pl-4",
                },
                {
                  header: "과목",
                  accessor: "subject",
                  className: "text-center",
                },
              ]}
              data={teachers}
              keyExtractor={(row) => row.id}
              emptyMessage="강사 정보가 없습니다."
            />
          </div>

          {/* 학생 리스트 */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                학생 리스트
              </h3>
              <button className="text-sm text-primary hover:underline">
                더보기 &gt;
              </button>
            </div>

            <Table
              columns={[
                { header: "NO", accessor: "id", className: "text-center" },
                {
                  header: "이름",
                  accessor: "name",
                  className: "text-center pl-4",
                },
              ]}
              data={students}
              keyExtractor={(row) => row.id}
              emptyMessage="학생 정보가 없습니다."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
