import { useState } from "react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import ReusablePieChart from "../../components/common/PieChart";
import Table from "../../components/common/Table";
import UserModal from "../../components/common/principal/UserModal";
import { useRecoilValue } from "recoil";
import { authState } from "../../stores/authStore";
import { useSearchUsers } from "../../api/generated/edutrack";

import UserPagination from "../../components/common/principal/UserPagination";
import { usePrincipalUsers } from "../../hooks/principal/usePrincipalUsers";

type UiUserRow = {
  id: number;
  name: string;
  userType: string;
  userId: string;
  phone: string;
};

export default function PrincipalUserManagement() {
  const auth = useRecoilValue(authState);
  const academyId = auth.user?.academy?.id;

  const [userList, setUserList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<"" | "강사" | "학생">("");
  const [selectedUser, setSelectedUser] = useState<UiUserRow | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const [page, setPage] = useState(1);
  const size = 10;
  // const [lastPage, setLastPage] = useState<number | null>(null);

  const { data: teachersAllRes } = useSearchUsers(
    academyId ?? 0,
    { role: "TEACHER", page: 1, size: 10000 },
    { query: { enabled: !!academyId } }
  );

  const { data: studentsAllRes } = useSearchUsers(
    academyId ?? 0,
    { role: "STUDENT", page: 1, size: 10000 },
    { query: { enabled: !!academyId } }
  );

  const teacherCount = (teachersAllRes as any)?.data?.totalElements ?? 0;
  const studentCount = (studentsAllRes as any)?.data?.totalElements ?? 0;

  const totalUsers = teacherCount + studentCount;

  const role =
    selectedType === "강사"
      ? "TEACHER"
      : selectedType === "학생"
      ? "STUDENT"
      : undefined;

  const { users, totalCount, totalPages, isLoading } = usePrincipalUsers(
    academyId,
    {
      enabled: userList,
      role,
      keyword: searchText,
      page,
      size,
    }
  );

  const usersNumber = {
    totalUsers,
    countTeacher: teacherCount,
    countStudent: studentCount,
  };

  const handleSearch = () => {
    setUserList(true);
    setPage(1);
    setSelectedUserIds([]);
  };

  const filteredUsers: UiUserRow[] = (userList ? users : []).map((u) => ({
    id: u.id ?? 0,
    name: u.name ?? "-",
    userType:
      u.role === "TEACHER"
        ? "강사"
        : u.role === "STUDENT"
        ? "학생"
        : u.role ?? "-",
    userId: u.loginId ?? "-",
    phone: u.phone ?? "-",
  }));

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) setSelectedUserIds((prev) => [...prev, userId]);
    else setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedUserIds(filteredUsers.map((u) => u.id));
    else setSelectedUserIds([]);
  };

  const handleDeleteUsers = () => {
    if (selectedUserIds.length === 0)
      return alert("삭제할 회원을 선택해주세요.");
    if (!confirm("선택한 회원을 삭제하시겠습니까?")) return;

    alert("삭제 API가 아직 없어서 서버에서 삭제할 수 없습니다.");
    setSelectedUserIds([]);
  };

  if (!academyId) {
    return (
      <Page>
        <Card className="p-8">학원 정보가 없습니다.</Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card className="flex mb-4">
        <div className="stat">
          <div className="stat-title">전체 회원 수</div>
          <div className="stat-value text-5xl">{usersNumber.totalUsers}</div>
        </div>
        <div className="stat">
          <div className="stat-title">강사</div>
          <div className="stat-value text-5xl">{usersNumber.countTeacher}</div>
        </div>
        <div className="stat">
          <div className="stat-title">학생</div>
          <div className="stat-value text-5xl">{usersNumber.countStudent}</div>
        </div>

        <div className="w-full h-32">
          <ReusablePieChart
            data={[
              { name: "학생", value: usersNumber.countStudent },
              { name: "강사", value: usersNumber.countTeacher },
            ]}
          />
        </div>
      </Card>

      <Card className="mb-4" title="사용자 검색">
        <div className="flex justify-between">
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as "강사" | "학생" | "")
            }
            className="select"
          >
            <option disabled={true} value="">
              회원 유형을 선택하세요
            </option>
            <option value="강사">강사</option>
            <option value="학생">학생</option>
          </select>

          <input
            type="text"
            placeholder="아이디 또는 전화번호를 입력해주세요"
            className="input w-full mx-5"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Button type="submit" onClick={handleSearch}>
            검색
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex justify-end mb-4">
          <Button onClick={handleDeleteUsers}>삭제</Button>
        </div>

        <Table
          columns={[
            {
              header: (
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={
                    filteredUsers.length > 0 &&
                    selectedUserIds.length === filteredUsers.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              ),
              accessor: (user: UiUserRow) => (
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={selectedUserIds.includes(user.id)}
                  onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                />
              ),
              className: "w-12 text-center",
            },
            {
              header: "이름",
              accessor: (user: UiUserRow) => (
                <button
                  className="text-gray-700 hover:text-gray-900 hover:underline"
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedUser(user);
                  }}
                >
                  {user.name}
                </button>
              ),
            },
            { header: "회원 유형", accessor: "userType" },
            { header: "아이디", accessor: "userId" },
            { header: "전화번호", accessor: "phone" },
          ]}
          data={filteredUsers}
          keyExtractor={(row: UiUserRow) => row.id}
          emptyMessage={
            userList ? "검색 결과가 없습니다." : "검색을 실행해주세요."
          }
        />

        {userList && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              총 {totalCount}명 · {totalPages}페이지 · 현재 {page}페이지
            </div>

            <UserPagination
              page={page}
              lastPage={totalPages}
              onChange={(p) => {
                setPage(p);
              }}
              maxButtons={5}
            />
          </div>
        )}
      </Card>

      {selectedUser && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          academyId={academyId}
          user={selectedUser}
          onSaved={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </Page>
  );
}
