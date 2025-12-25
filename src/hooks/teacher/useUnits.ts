import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUnit, getUnitsByLecture, type UnitDto, type CreateUnitRequest } from "../../api/teacher/units";

export const unitQueryKeys = {
  all: ["units"] as const,
  byLecture: (lectureId: number) => [...unitQueryKeys.all, "lecture", lectureId] as const,
};

export function useLectureUnits(lectureId: number, enabled: boolean) {
  return useQuery({
    queryKey: unitQueryKeys.byLecture(lectureId),
    queryFn: () => getUnitsByLecture(lectureId),
    enabled: enabled && lectureId > 0,
    staleTime: 30_000,
  });
}

export function useCreateUnit() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateUnitRequest) => createUnit(body),

    onSuccess: (created) => {
      const key = unitQueryKeys.byLecture(created.lectureId);
      qc.setQueryData<UnitDto[]>(key, (prev) => {
        const safePrev = prev ?? [];
        if (safePrev.some((u) => u.unitId === created.unitId)) return safePrev;
        return [...safePrev, created];
      });
    },
  });
}
