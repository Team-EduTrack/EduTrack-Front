import { useGetWeakUnits } from "../../api/generated/edutrack";

export function useStudentUnitCorrectRates(
  studentId: number,
  params?: any 
) {
  const query = useGetWeakUnits(studentId, params, {
    query: { enabled: !!studentId, staleTime: 0 },
  });

  const units = query.data?.data ?? [];

  return {
    ...query,
    units, 
  };
}
