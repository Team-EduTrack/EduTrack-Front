import { useGetLectureUnitCorrectRates } from "../../api/generated/edutrack";

export default function useLectureUnitCorrectRates(lectureId: number) {
  const query = useGetLectureUnitCorrectRates(lectureId, {
    query: {
      enabled: !!lectureId,
      staleTime: 0,
    },
  });

  return {
    ...query,
    unitCorrectRates: query.data?.data ?? [],
  };
}
