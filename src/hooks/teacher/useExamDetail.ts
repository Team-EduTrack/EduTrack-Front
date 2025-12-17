import { useGetExamDetail } from "../../api/generated/edutrack";

export default function useExamDetail(lectureId: number, examId: number) {
  const query = useGetExamDetail(lectureId, examId, {
    query: {
      enabled: !!lectureId && !!examId,
      staleTime: 0,
    },
  });

  return {
    ...query,
    examDetail: query.data?.data ?? null,
  };
}
