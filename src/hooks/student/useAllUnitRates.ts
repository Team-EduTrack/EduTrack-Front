import { useMemo } from "react";
import { useGetLectureUnitCorrectRates } from "../../api/generated/edutrack";

type UnitScore = { value: number; label: string };

export function useLectureUnitAvgScores(lectureId: number) {
  const query = useGetLectureUnitCorrectRates(lectureId, {
    query: { enabled: !!lectureId, staleTime: 0 },
  });

  const units = query.data?.data ?? [];

  const unitIds = useMemo(
    () =>
      units
        .map((u) => u.unitId)
        .filter((id): id is number => typeof id === "number"),
    [units]
  );

  const scores: UnitScore[] = useMemo(
    () =>
      unitIds.map((_, idx) => ({
        label: `${idx + 1}단원`, 
        value: units[idx]?.correctRate ?? 0,
      })),
    [unitIds, units]
  );

  return {
    ...query,
    unitIds,
    scores,
  };
}
