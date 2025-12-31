import { useMemo } from "react";
import { useSearchUsers } from "../../api/generated/edutrack";
import { normalizeUserSearchResponse } from "./normalizeUserSearch";

interface UsePrincipalUsersOptions {
  enabled?: boolean;
  role?: "STUDENT" | "TEACHER" | "PRINCIPAL" | "ADMIN" | "";
  keyword?: string;
  page?: number;
  size?: number;
}

export function usePrincipalUsers(
  academyId: number | undefined,
  options?: UsePrincipalUsersOptions
) {
  const { enabled = false, role, keyword, page = 1, size = 10 } = options || {};

  const trimmed = keyword?.trim() || "";
  const pageIndex = page - 1; 

  const query = useSearchUsers(
    academyId || 0,
    {
      role: role || undefined,
      keyword: trimmed || undefined,
      page: pageIndex,
      size,
    },
    {
      query: {
        enabled: enabled && !!academyId,
        refetchOnWindowFocus: false,
        staleTime: 30_000,

        keepPreviousData: false as any,

        queryKey: ["principalUsers", academyId, role ?? "ALL", trimmed, page, size],
      },
    }
  );

  const normalized = useMemo(() => {
    return normalizeUserSearchResponse(query.data?.data, page, size);
  }, [query.data?.data, page, size]);

  return {
    users: normalized.users,
    totalCount: normalized.totalCount,
    totalPages: normalized.totalPages,
    page,
    size,

    refetch: query.refetch,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  };
}

