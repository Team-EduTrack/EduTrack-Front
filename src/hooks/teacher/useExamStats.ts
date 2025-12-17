import { useGetExamQuestionCorrectRates } from "../../api/generated/edutrack";

export default function useExamQuestionCorrectRates(examId: number) {
  const query = useGetExamQuestionCorrectRates(examId, {
    query: {
      enabled: !!examId,
      staleTime: 0,
    },
  });

  return {
    ...query,
    questionCorrectRates: query.data?.data ?? [],
  };
}
