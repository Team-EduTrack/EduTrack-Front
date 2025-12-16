import type { AssignmentSubmissionStudentViewResponse } from "../api/generated/edutrack";

export type MySubmissionType = {
  submitted: boolean;
  submissionId: number | null;
  assignmentId: number;
  lectureName: string;
  teacherName: string;
  assignmentTitle: string;
  assignmentDescription: string;
  endDate: string;
  filePath: string | null;
  score: number | null;
  feedback: string | null;
};

export function toMySubmissionType(
  raw?: AssignmentSubmissionStudentViewResponse
): MySubmissionType {
  return {
    submitted: raw?.submitted ?? false,
    submissionId: raw?.submissionId ?? null,
    assignmentId: raw?.assignmentId ?? 0,
    lectureName: raw?.lectureName ?? "",
    teacherName: raw?.teacherName ?? "",
    assignmentTitle: raw?.assignmentTitle ?? "",
    assignmentDescription: raw?.assignmentDescription ?? "",
    endDate: raw?.endDate ?? "",
    filePath: raw?.filePath ?? null,
    score: raw?.score ?? null,
    feedback: raw?.feedback ?? null,
  };
}
