import { useState } from "react";
import { FiDownload, FiChevronDown } from "react-icons/fi";
import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const mockAssignment = {
  lectureName: "재미있는 영어",
  teacherName: "박선영",
  studentId: "student2024001",
  studentName: "김민준",
  description:
    "이번 달 첫 번째 주 원서 'Diary of a Wimpy Kid' 에 대한 독후감을 영어로 작성하여 제출하세요. 최소 300단어 이상 작성해야 합니다.",
  answer: "독후감을 열심히 작성했습니다. 이 책에서 가장 인상 깊었던 부분은...",
  file: {
    name: "김민준_독후감과제.pdf",
    url: "/files/assignment.pdf",
  },
};

const gradeOptions = [
  { value: "", label: "과제를 채점해주세요." },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "F", label: "F" },
];

export default function AssignmentGrading() {
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!grade) {
      alert("채점을 선택해주세요.");
      return;
    }
    alert(`채점 완료: ${grade}\n피드백: ${feedback}`);
  };

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
                {mockAssignment.lectureName}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-900 w-24 flex-shrink-0">
                강사 이름
              </span>
              <span className="text-sm text-gray-700 border-b border-gray-200 flex-1 pb-1">
                {mockAssignment.teacherName}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-900 w-24 flex-shrink-0">
                학생 아이디
              </span>
              <span className="text-sm text-gray-700 border-b border-gray-200 w-48 pb-1">
                {mockAssignment.studentId}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-900 w-24 flex-shrink-0">
                학생 이름
              </span>
              <span className="text-sm text-gray-700 border-b border-gray-200 w-48 pb-1">
                {mockAssignment.studentName}
              </span>
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold text-gray-900 block mb-2">
              과제 설명
            </span>
            <p className="text-sm text-gray-600 leading-relaxed">
              {mockAssignment.description}
            </p>
          </div>

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
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-900 w-12">답안</span>
              <span className="text-sm text-gray-600">
                {mockAssignment.answer}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-900 w-12">파일</span>
              <a
                href={mockAssignment.file.url}
                download
                className="inline-flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                {mockAssignment.file.name}
                <FiDownload size={14} />
              </a>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button onClick={handleSubmit}>저장하기</Button>
          </div>
        </div>
      </Card>
    </Page>
  );
}
