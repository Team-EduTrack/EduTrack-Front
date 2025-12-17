import { useGetLectureQuestionCorrectRates } from "../../api/generated/edutrack";

export default function useLectureQuestionCorrectRates(lectureId: number) {
  const query = useGetLectureQuestionCorrectRates(lectureId, {
    query: {
      enabled: !!lectureId,
      staleTime: 0,
    },
  });

  return {
    ...query,
    questionCorrectRates: query.data?.data ?? [],
  };
}
