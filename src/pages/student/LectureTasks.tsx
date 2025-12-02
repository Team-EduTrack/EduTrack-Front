import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import PageTitle from "../../components/common/PageTitle";
import TaskCard from "../../components/common/student/TaskCard";
import type {
  Assignment,
  Exam,
} from "../../components/common/student/TaskCard";

const mockLectures = [
  { id: 1, title: "영문법 수업", teacher: "김은아" },
  { id: 2, title: "보카 독파", teacher: "박상기" },
  { id: 3, title: "리딩 바이트", teacher: "이자은" },
  { id: 4, title: "그래머 인 유즈", teacher: "김민지" },
  { id: 5, title: "내신 콘서트 영어 능률", teacher: "강은경" },
];

const mockAssignmentsByLecture: Record<number, Assignment[]> = {
  1: [
    { id: 1, title: "구문 분석 숙제", dueDate: "2025-03-01", status: "미제출" },
    {
      id: 2,
      title: "문장 성분 정리",
      dueDate: "2025-03-05",
      status: "제출완료",
    },
  ],
  2: [
    { id: 1, title: "구문 분석 숙제", dueDate: "2025-03-01", status: "미제출" },
  ],
  3: [
    { id: 1, title: "구문 분석 숙제", dueDate: "2025-03-01", status: "미제출" },
    {
      id: 2,
      title: "문장 성분 정리",
      dueDate: "2025-03-05",
      status: "제출완료",
    },
  ],
  4: [
    { id: 1, title: "구문 분석 숙제", dueDate: "2025-03-01", status: "미제출" },
    {
      id: 2,
      title: "문장 성분 정리",
      dueDate: "2025-03-05",
      status: "제출완료",
    },
  ],
  5: [
    { id: 1, title: "구문 분석 숙제", dueDate: "2025-03-01", status: "미제출" },
  ],
};

const mockExamsByLecture: Record<number, Exam[]> = {
  1: [
    {
      id: 1,
      title: "3월 모의고사",
      endDate: "2025-03-05",
      duration: 60,
      status: "응시 가능",
    },
    {
      id: 2,
      title: "단원평가 1회",
      endDate: "2025-02-25",
      duration: 45,
      status: "응시 완료",
    },
  ],
  2: [
    {
      id: 1,
      title: "3월 모의고사",
      endDate: "2025-03-05",
      duration: 60,
      status: "응시 가능",
    },
    {
      id: 2,
      title: "단원평가 1회",
      endDate: "2025-02-25",
      duration: 45,
      status: "응시 완료",
    },
  ],
  3: [
    {
      id: 1,
      title: "3월 모의고사",
      endDate: "2025-03-05",
      duration: 60,
      status: "응시 가능",
    },
  ],
  4: [
    {
      id: 1,
      title: "3월 모의고사",
      endDate: "2025-03-05",
      duration: 60,
      status: "응시 가능",
    },
  ],
  5: [
    {
      id: 1,
      title: "3월 모의고사",
      endDate: "2025-03-05",
      duration: 60,
      status: "응시 가능",
    },
    {
      id: 2,
      title: "단원평가 1회",
      endDate: "2025-02-25",
      duration: 45,
      status: "응시 완료",
    },
  ],
};

export default function LectureTasks() {
  return (
    <Page>
      <div className="space-y-6">
        <PageTitle title="과제/시험 제출" />
        <Card className="space-y-4">
          {mockLectures.map((lecture) => (
            <TaskCard
              key={lecture.id}
              lecture={lecture}
              assignments={mockAssignmentsByLecture[lecture.id] ?? []}
              exams={mockExamsByLecture[lecture.id] ?? []}
            />
          ))}
        </Card>
      </div>
    </Page>
  );
}
