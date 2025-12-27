import { useEffect, useMemo, useState } from "react";
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

  const query = useSearchUsers(
    academyId || 0,
    {
      role: role || undefined,
      keyword: keyword?.trim() || undefined,
      page,
      size,
    },
    {
      query: {
        enabled: enabled && !!academyId,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
        keepPreviousData: true as any,
      },
    }
  );

  const [stableBody, setStableBody] = useState<any>(null);

  useEffect(() => {
    if (query.data?.data != null) {
      setStableBody(query.data.data);
    }
  }, [query.data?.data]);

  const bodyForRender = query.data?.data ?? stableBody;

  const normalized = useMemo(() => {
    return normalizeUserSearchResponse(bodyForRender, page, size);
  }, [bodyForRender, page, size]);

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
