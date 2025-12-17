import { useGetSubmissions } from "../../api/generated/edutrack";

export default function useSubmissions(academyId: number, assignmentId: number) {
  const query = useGetSubmissions(academyId, assignmentId, {
    query: {
      enabled: !!academyId && !!assignmentId,
      staleTime: 0,
    },
  });

  return {
    ...query,
    submissions: query.data?.data ?? [],
  };
}
