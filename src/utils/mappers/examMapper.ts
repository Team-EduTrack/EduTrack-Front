import type { ExamSummaryResponse } from "../../api/generated/edutrack";
import type { Exam } from "../../components/common/student/TaskCard";

export function mapExam(api: ExamSummaryResponse): Exam {
  return {
    id: api.examId!,
    title: api.title ?? "",
    endDate: api.endDate?.slice(0, 10) ?? "",
    duration: 60, // 백엔드에서 제공되면 수정
    status:
      api.status === "COMPLETED"
        ? "응시 완료"
        : api.status === "EXPIRED"
        ? "기간 만료"
        : "응시 가능",
  };
}
