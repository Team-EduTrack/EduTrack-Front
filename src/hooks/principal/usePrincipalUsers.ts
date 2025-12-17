import { useSearchUsers } from "../../api/generated/edutrack";

interface UsePrincipalUsersOptions {
  enabled?: boolean;
  role?: "STUDENT" | "TEACHER" | "PRINCIPAL" | "ADMIN" | "";
  keyword?: string;
}

export function usePrincipalUsers(
  academyId: number | undefined,
  options?: UsePrincipalUsersOptions
) {
  const { enabled = false, role, keyword } = options || {};

  const query = useSearchUsers(
    academyId || 0,
    {
      role: role || undefined,
      keyword: keyword || undefined,
    },
    {
      query: {
        enabled: enabled && !!academyId,
        staleTime: 0,
      },
    }
  );

  return {
    users: query.data?.data ?? [],
    refetch: query.refetch,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
