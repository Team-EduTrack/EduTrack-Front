import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  getStudentUnitCorrectRate,
  getGetStudentUnitCorrectRateQueryKey,
} from "../../api/generated/edutrack";

type UnitScore = { value: number; label: string };

export function useStudentLectureUnitScores(params: {
  studentId: number;
  unitIds: number[];  
  labels?: string[];  
}) {
  const { studentId, unitIds, labels } = params;

  const queries = useQueries({
    queries: unitIds.map((unitId, idx) => ({
      queryKey: getGetStudentUnitCorrectRateQueryKey(unitId, studentId),
      queryFn: ({ signal }: { signal?: AbortSignal }) =>
        getStudentUnitCorrectRate(unitId, studentId, { signal }),
      enabled: !!studentId && unitIds.length > 0,
      staleTime: 0,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);

  const scores: UnitScore[] = useMemo(() => {
    return unitIds.map((_, idx) => ({
      label: labels?.[idx] ?? `${idx + 1}단원`,
      value: queries[idx]?.data?.data?.correctRate ?? 0,
    }));
  }, [unitIds, labels, queries]);

  return {
    isLoading,
    scores,
  };
}
