import { useGetMySubmission } from "../../api/generated/edutrack";
import { useAuth } from "../useAuth";

export function useMyAssignmentSubmission(assignmentId: number) {
  const { academyId } = useAuth();

  const {
    data,
    isLoading,
    isError,
  } = useGetMySubmission(
    academyId!,
    assignmentId,
    {
      query: {
        enabled: !!academyId && !!assignmentId,
        retry: false,
      },
    }
  );

  return {
    submission: data?.data,
    isSubmitted: !!data,
    isLoading,
    isError,
  };
}
