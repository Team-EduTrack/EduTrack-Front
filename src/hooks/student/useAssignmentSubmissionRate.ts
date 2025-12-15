import {
  AssignmentListResponseStatus,
  useGetAssignmentsForLecture,
} from "../../api/generated/edutrack";
import { authState } from "../../stores/authStore";

import { useRecoilValue } from "recoil";

export default function useAssignmentSubmissionRate(lectureId?: number) {
  const auth = useRecoilValue(authState);
  const academyId = auth.user?.academy?.id;

  const {
    data: assignmentsResponse,
    isLoading,
    error,
  } = useGetAssignmentsForLecture(academyId!, lectureId!, {
    query: {
      enabled: !!academyId && !!lectureId,
    },
  });

  const assignments = assignmentsResponse?.data ?? [];

  const submitted = assignments.filter(
    (a) => a.status === AssignmentListResponseStatus.SUBMITTED
  ).length;

  const total = assignments.length;

  return {
    submitted,
    total,
    isLoading,
    error,
    assignments,
  };
}
