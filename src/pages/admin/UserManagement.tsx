import { useMemo, useState, useEffect } from "react";
import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import UserPagination from "../../components/common/principal/UserPagination";

import { useGetAllUsers } from "../../api/generated/edutrack";
import type { UserSearchResultResponse } from "../../api/generated/edutrack";

type UiUserRow = {
  id: number;
  name: string;
  userType: string;
  userId: string;
  phone: string;
  email: string;
};

export default function AdminUserManagement() {
  // UI 상태
  const [page, setPage] = useState(1); // 1-base
  const size = 10;

  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState<"" | "STUDENT" | "TEACHER" | "PRINCIPAL">(
    ""
  );

  const trimmed = keyword.trim();

  // ✅ 전체를 크게 받아오기 (프론트에서 필터+페이지네이션)
  const fetchPage = 0;
  const fetchSize = 10000; // 데이터 많으면 더 키우거나, 백엔드에 맞게 조절

  const query = useGetAllUsers({
    axios: {
      params: {
        page: fetchPage,
        size: fetchSize,
      },
    },
    query: {
      enabled: true,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      keepPreviousData: true as any,
      queryKey: ["adminUsersAll", fetchPage, fetchSize],
    },
  });

  const allUsers: UserSearchResultResponse[] = query.data?.data?.users ?? [];

  // ✅ ADMIN 제외 + role/keyword 필터링
  const filteredAll = useMemo(() => {
    const kw = trimmed.toLowerCase();

    return allUsers.filter((u) => {
      // 1) 관리자 제외
      if (u.role === "ADMIN") return false;

      // 2) 역할 필터 (선택된 경우만)
      if (role && u.role !== role) return false;

      // 3) 키워드 필터 (선택된 경우만)
      if (kw) {
        const hay = [u.name, u.loginId, u.phone, u.email, u.role]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!hay.includes(kw)) return false;
      }

      return true;
    });
  }, [allUsers, role, trimmed]);

  // ✅ 프론트 페이지네이션 계산
  const totalCount = filteredAll.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / size));

  // 페이지가 필터링으로 줄어들면 범위 보정
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]); // eslint-disable-line react-hooks/exhaustive-deps

  const pageUsers = useMemo(() => {
    const start = (page - 1) * size;
    return filteredAll.slice(start, start + size);
  }, [filteredAll, page]);

  const rows: UiUserRow[] = useMemo(() => {
    return pageUsers.map((u) => ({
      id: u.id ?? 0,
      name: u.name ?? "-",
      userType:
        u.role === "TEACHER"
          ? "강사"
          : u.role === "STUDENT"
          ? "학생"
          : u.role === "PRINCIPAL"
          ? "원장"
          : u.role ?? "-",
      userId: u.loginId ?? "-",
      phone: u.phone ?? "-",
      email: u.email ?? "-",
    }));
  }, [pageUsers]);

  const onSearch = () => {
    setPage(1);
  };

  return (
    <Page>
      <Card className="mb-4" title="사용자 조회">
        <div className="flex gap-3 items-center">
          <select
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value as "" | "STUDENT" | "TEACHER" | "PRINCIPAL"
              )
            }
            className="select"
          >
            <option value="">전체</option>
            <option value="TEACHER">강사</option>
            <option value="STUDENT">학생</option>
            <option value="PRINCIPAL">원장</option>
          </select>

          <input
            className="input w-full"
            placeholder="이름/아이디/전화번호/이메일 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />

          <Button onClick={onSearch}>검색</Button>
        </div>
      </Card>

      <Card>
        <Table
          columns={[
            { header: "이름", accessor: "name" },
            { header: "역할", accessor: "userType" },
            { header: "아이디", accessor: "userId" },
            { header: "전화번호", accessor: "phone" },
            { header: "이메일", accessor: "email" },
          ]}
          data={rows}
          keyExtractor={(row: UiUserRow) => row.id || row.userId}
          emptyMessage={
            query.isLoading ? "불러오는 중..." : "사용자 정보가 없습니다."
          }
        />

        <div className="flex items-center justify-end mt-4">
          <UserPagination
            page={page}
            lastPage={totalPages}
            onChange={(p) => setPage(p)}
            maxButtons={5}
          />
        </div>
      </Card>
    </Page>
  );
}
