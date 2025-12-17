import { useGetSubmissionForTeacher } from "../../api/generated/edutrack";

export default function useSubmissionForTeacher(
  academyId: number,
  assignmentId: number,
  submissionId: number
) {
  const query = useGetSubmissionForTeacher(academyId, assignmentId, submissionId, {
    query: {
      enabled: !!academyId && !!assignmentId && !!submissionId,
      staleTime: 0,
    },
  });

  return {
    ...query,
    submission: query.data?.data ?? null,
  };
}
