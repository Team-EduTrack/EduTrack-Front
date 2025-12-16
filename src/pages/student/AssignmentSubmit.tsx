import { useNavigate, useParams } from "react-router-dom";
import Page from "../../components/common/Page";
import PageTitle from "../../components/common/PageTitle";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { useState, type FormEvent } from "react";
import { useSubmitAssignmentMutation } from "../../hooks/student/useAssignmentSubmissionMutation";
import { useGetMySubmission } from "../../api/generated/edutrack";
import { toMySubmissionType } from "../../types/assignment";
import { useRecoilValue } from "recoil";
import { authState } from "../../stores/authStore";

export default function AssignmentSubmit() {
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);

  const academyId = auth.user?.academy?.id;

  const { assignmentId } = useParams();
  const parsedAssignmentId = Number(assignmentId);

  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | undefined>();

  const submitMutation = useSubmitAssignmentMutation();

  const { data: mySubmissionRes, isLoading } = useGetMySubmission(
    academyId!,
    parsedAssignmentId
  );
  const mySubmission = toMySubmissionType(mySubmissionRes?.data);

  if (isLoading) {
    return (
      <Page>
        <PageTitle title="과제 제출" />
        <Card className="p-8">과제 제출 상태를 확인 중입니다.</Card>
      </Page>
    );
  }

  if (!mySubmission) {
    return (
      <Page>
        <PageTitle title="과제 제출" />
        <Card className="p-8">존재하지 않는 과제입니다.</Card>
      </Page>
    );
  }

  if (mySubmission.submitted) {
    return (
      <Page>
        <PageTitle title="과제 제출" />
        <Card className="p-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            이미 제출한 과제입니다
          </h2>

          <p className="text-sm text-gray-600">
            과제명: {mySubmission.assignmentTitle}
          </p>

          <p className="text-sm text-gray-600">
            제출 파일: {mySubmission.filePath ?? "-"}
          </p>

          <p className="text-sm text-gray-600">
            점수: {mySubmission.score ?? "채점 전"}
          </p>

          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            피드백: {mySubmission.feedback ?? "아직 피드백이 없습니다."}
          </p>

          <Button disabled>제출 완료</Button>
        </Card>
      </Page>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const ok = window.confirm("과제를 제출하시겠습니까?");
    if (!ok) return;

    submitMutation.mutate(
      {
        academyId: academyId!,
        assignmentId: parsedAssignmentId,
        content,
        file,
      },
      {
        onSuccess: () => navigate("/student/tasks"),
        onError: () => alert("제출 실패"),
      }
    );
  };

  return (
    <Page>
      <PageTitle className="mb-4" title="과제 제출" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="p-8 space-y-4">
          <article className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {mySubmission.lectureName}
            </h1>
            <p className="text-sm text-gray-600 font-semibold">
              {mySubmission.teacherName} 강사님
            </p>

            <p className="text-sm text-gray-600 font-semibold">
              마감 기한 :
              <span className="font-bold ml-2">{mySubmission.endDate}</span>
            </p>
            <div>
              <p className="text-sm text-gray-600 font-semibold">과제 설명</p>
              <p className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 leading-relaxed mt-3">
                {mySubmission.assignmentDescription}
              </p>
            </div>
          </article>
          <textarea
            className="textarea textarea-bordered w-full h-48"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="제출 과제에 대한 설명을 입력해주세요."
          />
          <article className="flex justify-between">
            <input
              type="file"
              className="file-input"
              onChange={(e) => setFile(e.target.files?.[0])}
            />
            <Button type="submit">제출하기</Button>
          </article>
        </Card>
      </form>
    </Page>
  );
}
