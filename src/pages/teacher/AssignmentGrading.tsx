import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { FiDownload, FiChevronDown } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { authState } from "../../stores/authStore";
import {
  useSubmission,
  useGradeSubmission,
} from "../../hooks/teacher";

const gradeOptions = [
  { value: "", label: "점수를 선택해주세요." },
  { value: "100", label: "100점" },
  { value: "90", label: "90점" },
  { value: "80", label: "80점" },
  { value: "70", label: "70점" },
  { value: "60", label: "60점" },
  { value: "50", label: "50점" },
  { value: "40", label: "40점" },
  { value: "30", label: "30점" },
  { value: "20", label: "20점" },
  { value: "10", label: "10점" },
  { value: "0", label: "0점" },
];

export default function AssignmentGrading() {
  const { assignmentId, submissionId } = useParams<{
    assignmentId: string;
    submissionId: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const auth = useRecoilValue(authState);
  const academyId = auth.user?.academy?.id ?? 0;

  const { submission, isLoading, isError } = useSubmission(
    academyId,
    Number(assignmentId),
    Number(submissionId)
  );

  const { gradeSubmission, isPending: isGrading } = useGradeSubmission();

  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    if (!grade) {
      alert("점수를 선택해주세요.");
      return;
    }

    try {
      await gradeSubmission({
        academyId,
        assignmentId: Number(assignmentId),
        submissionId: Number(submissionId),
        data: {
          score: Number(grade),
          feedback: feedback || undefined,
        },
      });
      alert("채점이 완료되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["/api/academies"] });
      navigate(-1);
    } catch (error) {
      console.error("Failed to grade submission:", error);
      alert("채점에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Page>
    );
  }

  if (isError || !submission) {
    return (
      <Page>
        <Card>
          <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <h1 className="text-xl font-bold text-gray-900 mb-6">과제 채점</h1>

      <Card>
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-900 w-24 flex-shrink-0">
                강의 명
              </span>
              <span className="text-sm text-gray-700 border-b border-gray-200 flex-1 pb-1">
                {submission.lectureName ?? "-"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-900 w-24 flex-shrink-0">
                강사 이름
              </span>
              <span className="text-sm text-gray-700 border-b border-gray-200 flex-1 pb-1">
                {submission.teacherName ?? "-"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-900 w-24 flex-shrink-0">
                학생 아이디
              </span>
              <span className="text-sm text-gray-700 border-b border-gray-200 w-48 pb-1">
                {submission.studentLoginId ?? "-"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-900 w-24 flex-shrink-0">
                학생 이름
              </span>
              <span className="text-sm text-gray-700 border-b border-gray-200 w-48 pb-1">
                {submission.studentName ?? "-"}
              </span>
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold text-gray-900 block mb-2">
              과제 설명
            </span>
            <p className="text-sm text-gray-600 leading-relaxed">
              {submission.assignmentDescription ?? "-"}
            </p>
          </div>

          {/* 기존 점수가 있으면 표시 */}
          {submission.score !== null && submission.score !== undefined && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">기존 점수:</span> {submission.score}점
              </p>
              {submission.feedback && (
                <p className="text-sm text-blue-700 mt-1">
                  <span className="font-semibold">기존 피드백:</span> {submission.feedback}
                </p>
              )}
            </div>
          )}

          <div className="relative w-full max-w-sm">
            <select
              className="w-full h-10 pl-4 pr-10 text-sm bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              {gradeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FiChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>

          <div>
            <textarea
              className="w-full h-36 p-4 text-sm bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="과제 피드백을 입력해주세요."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div className="space-y-3 pt-2">
            {submission.filePath && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-900 w-12">파일</span>
                <a
                  href={submission.filePath}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  제출된 파일 다운로드
                  <FiDownload size={14} />
                </a>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={isGrading}>
              {isGrading ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </div>
      </Card>
    </Page>
  );
}
