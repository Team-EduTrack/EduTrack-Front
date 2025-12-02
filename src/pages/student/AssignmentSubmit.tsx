import { useNavigate } from "react-router-dom";
import Page from "../../components/common/Page";
import PageTitle from "../../components/common/PageTitle";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import type { FormEvent } from "react";

const mockAssignment = {
  lectureName: "영문법 수업",
  teacherName: "김은아",
  dueDate: "2025-12-10",
  description:
    "이번 달 첫 번째 주 원서 ‘Diary of a Wimpykid’ 에서 배운 문법 요소들을 찾아 설명과 함께 a4 두장 분량으로 작성하여 제출하세요.",
};

export default function AssignmentSubmit() {
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const ok = window.confirm("정말 제출하시겠습니까?");
    if (!ok) return;

    navigate(`/student/tasks`);
  };

  return (
    <Page>
      <PageTitle className="mb-4" title="과제 제출" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="p-8 space-y-4">
          <article className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {mockAssignment.lectureName}
            </h1>
            <p className="text-sm text-gray-600 font-semibold">
              {mockAssignment.teacherName} 강사님
            </p>

            <p className="text-sm text-gray-600 font-semibold">
              마감 기한 :{" "}
              <span className="font-bold">{mockAssignment.dueDate}</span>
            </p>
            <div>
              <p className="text-sm text-gray-600 font-semibold">과제 설명</p>
              <p className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 leading-relaxed mt-3">
                {mockAssignment.description}
              </p>
            </div>
          </article>
          <textarea
            className="textarea textarea-bordered w-full h-48"
            placeholder="제출 과제에 대한 설명을 입력해주세요."
          ></textarea>
          <article className="flex justify-between">
            <input type="file" className="file-input" />
            <Button type="submit">제출하기</Button>
          </article>
        </Card>
      </form>
    </Page>
  );
}
