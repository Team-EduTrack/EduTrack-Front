import { useState } from "react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import ReusablePieChart from "../../components/common/PieChart";
import Table from "../../components/common/Table";
import UserModal from "../../components/common/principal/UserModal";

const mockUsersNumber = {
  totalUsers: 57,
  countTeacher: 10,
  countStudent: 47,
};

const mockUsers = [
  {
    id: 1,
    name: "김은아",
    userType: "강사",
    userId: "adk123",
    phone: "01093489203",
    email: "ask938@nd.com",
    profileImage: null,
  },
  {
    id: 2,
    name: "김아현",
    userType: "학생",
    userId: "adk33",
    phone: "01093989203",
    email: "aii998@nd.com",
    profileImage: null,
  },
  {
    id: 3,
    name: "김은지",
    userType: "강사",
    userId: "adk5623",
    phone: "01093489298",
    email: "nkk091@nd.com",
    profileImage: null,
  },
];

export default function PrincipalUserManagement() {
  const [userList, setUserList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<"" | "강사" | "학생">("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [users, setUsers] = useState(mockUsers);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const handleSearch = () => {
    setUserList(true);
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUserIds((prev) => [...prev, userId]);
    } else {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleDeleteUsers = () => {
    if (selectedUserIds.length === 0)
      return alert("삭제할 회원을 선택해주세요.");

    if (!confirm("선택한 회원을 삭제하시겠습니까?")) return;

    setUsers((prev) => prev.filter((u) => !selectedUserIds.includes(u.id)));
    setSelectedUserIds([]); // 선택 초기화
  };

  const handleUpdateUserType = (updatedUser) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  let filteredUsers = [];

  if (userList) {
    filteredUsers = users;

    if (selectedType) {
      filteredUsers = filteredUsers.filter(
        (user) => user.userType === selectedType
      );
    }

    if (searchText.trim() !== "") {
      const keyword = searchText.trim();

      filteredUsers = filteredUsers.filter(
        (user) => user.userId.includes(keyword) || user.phone.includes(keyword)
      );
    }
  }

  return (
    <Page>
      <Card className="flex mb-4">
        <div className="stat">
          <div className="stat-title">전체 회원 수</div>
          <div className="stat-value text-5xl">
            {mockUsersNumber.totalUsers}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">강사</div>
          <div className="stat-value text-5xl">
            {mockUsersNumber.countTeacher}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">학생</div>
          <div className="stat-value text-5xl">
            {mockUsersNumber.countStudent}
          </div>
        </div>
        <div className="w-full h-32">
          <ReusablePieChart
            data={[
              {
                name: "학생",
                value: mockUsersNumber.countStudent,
              },
              { name: "강사", value: mockUsersNumber.countTeacher },
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
              accessor: (user) => (
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
              accessor: (user) => (
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
            {
              header: "회원 유형",
              accessor: "userType",
            },
            {
              header: "아이디",
              accessor: "userId",
            },
            {
              header: "전화번호",
              accessor: "phone",
            },
          ]}
          data={filteredUsers}
          keyExtractor={(row) => row.id}
        ></Table>
      </Card>
      {selectedUser && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          onSave={handleUpdateUserType}
        />
      )}
    </Page>
  );
}
