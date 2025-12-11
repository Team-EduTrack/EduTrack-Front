import type { AssignmentListResponse } from "../../api/generated/edutrack";
import type { Assignment } from "../../components/common/student/TaskCard";

export function mapAssignment(api: AssignmentListResponse): Assignment {
  return {
    id: api.assignmentId!,
    title: api.title ?? "",
    dueDate: api.endDate?.slice(0, 10) ?? "",
    status: api.status === "SUBMITTED" ? "제출완료" : "미제출",
  };
}
