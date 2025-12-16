import { useState, useMemo } from "react";
import CreateModal from "../../components/admin/CreateModal";
import SuccessModal from "../../components/admin/SuccessModal";
import Table from "../../components/common/Table";
import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import Button from "../../components/common/Button";
import type { User } from "../../types/user";

export default function UserManagement() {
  const [searchType, setSearchType] = useState("회원을 선택하세요");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchType, setActiveSearchType] = useState("회원을 선택하세요");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const filteredUsers = useMemo(() => {
    let result = [...users];
    result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    if (activeSearchQuery.trim()) {
      result = result.filter((user) => {
        const matchesRole =
          activeSearchType === "회원을 선택하세요" ||
          user.role === activeSearchType;
        const matchesQuery = user.userId
          .toLowerCase()
          .includes(activeSearchQuery.toLowerCase());
        return matchesRole && matchesQuery;
      });
    }
    return result;
  }, [users, activeSearchType, activeSearchQuery]);

  const handleSearch = () => {
    setActiveSearchType(searchType);
    setActiveSearchQuery(searchQuery);
  };

  const handleDirectorCreated = (code: string, newUser: User) => {
    setUsers((prev) => [newUser, ...prev]);
    setIsCreateModalOpen(false);
    setGeneratedCode(code);
    setIsSuccessModalOpen(true);
  };

  return (
    <Page>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">사용자 관리</h2>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            원장 계정 생성
          </Button>
        </div>
        <div className="flex gap-3 mb-6">
          <select
            className="select select-bordered w-48 bg-white"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option disabled>회원을 선택하세요</option>
            <option>원장</option>
            <option>선생님</option>
            <option>학생</option>
          </select>
          <input
            type="text"
            placeholder="아이디 검색"
            className="input input-bordered flex-1 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="neutral" onClick={handleSearch}>
            검색
          </Button>
        </div>
        <Table
          columns={[
            {
              header: "NO",
              accessor: (user) => filteredUsers.indexOf(user) + 1,
            },
            { header: "이름", accessor: "name" },
            { header: "직책", accessor: "role" },
            { header: "아이디", accessor: "userId" },
            { header: "학원 코드", accessor: "code" },
          ]}
          data={filteredUsers}
          keyExtractor={(user) => user.id}
          emptyMessage="검색 결과가 없습니다."
        />
      </Card>
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleDirectorCreated}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        generatedCode={generatedCode}
      />
    </Page>
  );
}
