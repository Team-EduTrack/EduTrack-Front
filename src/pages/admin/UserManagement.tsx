import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CreateModal from "../../components/admin/CreateModal";
import SuccessModal from "../../components/admin/SuccessModal";
import Table from "../../components/common/Table";
import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import Button from "../../components/common/Button";
import { useAllUsers } from "../../hooks/admin";
import { getGetAllUsersQueryKey } from "../../api/generated/edutrack";
import { roleToKorean, koreanToRole } from "../../utils/role";

export default function UserManagement() {
  const queryClient = useQueryClient();

  const [searchType, setSearchType] = useState("회원을 선택하세요");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchType, setActiveSearchType] = useState("회원을 선택하세요");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const { users, totalCount, isLoading, isError } = useAllUsers();

  const filteredUsers = useMemo(() => {
    if (activeSearchType === "회원을 선택하세요" && !activeSearchQuery.trim()) {
      return users;
    }

    const targetRole = koreanToRole(activeSearchType);

    return users.filter((user) => {
      const matchesRole = !targetRole || user.role === targetRole;
      const matchesQuery =
        !activeSearchQuery.trim() ||
        user.loginId?.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
        user.name?.toLowerCase().includes(activeSearchQuery.toLowerCase());
      return matchesRole && matchesQuery;
    });
  }, [users, activeSearchType, activeSearchQuery]);

  const handleSearch = () => {
    setActiveSearchType(searchType);
    setActiveSearchQuery(searchQuery);
  };

  const handleDirectorCreated = (code: string) => {
    queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
    setIsCreateModalOpen(false);
    setGeneratedCode(code);
    setIsSuccessModalOpen(true);
  };

  if (isLoading) {
    return (
      <Page>
        <Card>
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </Card>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <Card>
          <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            사용자 관리
            <span className="text-sm font-normal text-gray-500 ml-2">
              (총 {totalCount}명)
            </span>
          </h2>
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
            placeholder="아이디 또는 이름 검색"
            className="input input-bordered flex-1 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button variant="neutral" onClick={handleSearch}>
            검색
          </Button>
        </div>
        <Table
          columns={[
            {
              header: "NO",
              accessor: (_, index) => index + 1,
              className: "w-16 text-center",
            },
            { header: "이름", accessor: (user) => user.name ?? "-" },
            { header: "직책", accessor: (user) => roleToKorean(user.role) },
            { header: "아이디", accessor: (user) => user.loginId ?? "-" },
            { header: "이메일", accessor: (user) => user.email ?? "-" },
            { header: "전화번호", accessor: (user) => user.phone ?? "-" },
          ]}
          data={filteredUsers}
          keyExtractor={(user) => user.id ?? 0}
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
