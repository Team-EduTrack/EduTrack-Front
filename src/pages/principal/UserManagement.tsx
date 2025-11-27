import { useState } from "react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import ReusablePieChart from "../../components/common/PieChart";
import Table from "../../components/common/Table";

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
  },
  {
    id: 2,
    name: "김아현",
    userType: "학생",
    userId: "adk33",
    phone: "01093989203",
  },
  {
    id: 3,
    name: "김은지",
    userType: "강사",
    userId: "adk5623",
    phone: "01093489298",
  },
];

export default function PrincipalUserManagement() {
  const [userList, setUserList] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<"" | "강사" | "학생">("");

  const handleSearch = () => {
    setUserList(true);
  };

  let filteredUsers = [];

  if (userList) {
    filteredUsers = mockUsers;

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
          <Button>삭제</Button>
        </div>
        <Table
          columns={[
            {
              header: (
                <input type="checkbox" className="checkbox checkbox-sm" />
              ),
              accessor: () => (
                <input type="checkbox" className="checkbox checkbox-sm" />
              ),
              className: "w-12 text-center",
            },
            {
              header: "이름",
              accessor: "name",
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
    </Page>
  );
}
