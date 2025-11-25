import { useState } from "react";
import { FiCalendar, FiPlus } from "react-icons/fi";
import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import AddQuestionModal from "../../components/teacher/AddQuestionModal";

type TabType = "exam" | "assignment";

interface Question {
  id: number;
  unit: string;
  answer: number;
  score: number;
  difficulty: "상" | "중" | "하";
  question: string;
  options: string[];
}

const mockLectures = [
  { id: 1, name: "재미있는 영어" },
  { id: 2, name: "영문법 수업" },
  { id: 3, name: "보카 독파" },
];

export default function ExamManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("exam");
  const [selectedLecture, setSelectedLecture] = useState(mockLectures[0].id);
  const [examName, setExamName] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("60");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const selectedLectureName =
    mockLectures.find((l) => l.id === selectedLecture)?.name || "";
  const isExam = activeTab === "exam";

  const handleAddQuestion = (question: Question) => {
    setQuestions((prev) => [...prev, question]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExam) {
      alert(`시험이 생성되었습니다: ${examName}\n문제 수: ${questions.length}`);
    } else {
      alert(`과제가 생성되었습니다: ${examName}`);
    }
  };

  const tabClass = (isActive: boolean) =>
    `h-14 text-base font-semibold rounded-md transition-colors flex items-center justify-center gap-3 ${
      isActive
        ? "bg-gray-800 text-white"
        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
    }`;

  const radioClass = (isActive: boolean) =>
    `w-4 h-4 rounded-full border-2 ${isActive ? "bg-white border-white" : "border-gray-400"}`;

  return (
    <Page>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            className={tabClass(isExam)}
            onClick={() => setActiveTab("exam")}
          >
            <span className={radioClass(isExam)} />
            시험 생성하기
          </button>
          <button
            className={tabClass(!isExam)}
            onClick={() => setActiveTab("assignment")}
          >
            <span className={radioClass(!isExam)} />
            과제 생성하기
          </button>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                강의 선택
              </label>
              <select
                className="select select-bordered w-full max-w-md bg-white"
                value={selectedLecture}
                onChange={(e) => setSelectedLecture(Number(e.target.value))}
              >
                {mockLectures.map((lecture) => (
                  <option key={lecture.id} value={lecture.id}>
                    {lecture.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isExam ? "시험명" : "과제명"}
              </label>
              <input
                type="text"
                className="input input-bordered w-full max-w-md bg-white"
                placeholder={`${selectedLectureName} | ${isExam ? "1차 지필평가" : "2025 11월 영어 독후감 쓰기"}`}
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </div>

            {!isExam && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명
                </label>
                <textarea
                  className="w-full h-24 p-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
                  placeholder="이번 달 첫 번째 주 원서 'Diary of a Wimpkid' 에 대한 독후감을 영어로 작성하여 제출하세요."
                  value={assignmentDescription}
                  onChange={(e) => setAssignmentDescription(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isExam ? "응시 기간" : "제출 기간"}
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded whitespace-nowrap">
                    시작
                  </span>
                  <div className="relative">
                    <input
                      type="date"
                      className="input input-bordered bg-white pr-10"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded whitespace-nowrap">
                    종료
                  </span>
                  <div className="relative">
                    <input
                      type="date"
                      className="input input-bordered bg-white pr-10"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                {isExam && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded whitespace-nowrap">
                      시간
                    </span>
                    <select
                      className="select select-bordered bg-white"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <option value="30">30 분</option>
                      <option value="60">60 분</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {isExam && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    문제 리스트
                  </label>
                  <Button
                    type="button"
                    variant="neutral"
                    size="sm"
                    onClick={() => setIsQuestionModalOpen(true)}
                  >
                    문제 더하기
                  </Button>
                </div>
                <div className="space-y-3">
                  {questions.length === 0 ? (
                    <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                      문제 더하기 버튼을 클릭하여 문제를 추가하세요.
                    </div>
                  ) : (
                    <>
                      {questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="border border-gray-200 rounded-lg p-4 space-y-2"
                        >
                          <p className="font-medium text-gray-900">
                            문제 {index + 1}. {question.question.split("\n")[0]}
                          </p>
                          {question.question.split("\n").slice(1).join("\n") && (
                            <p className="text-sm text-gray-600">
                              {question.question.split("\n").slice(1).join("\n")}
                            </p>
                          )}
                          <div className="space-y-1 pt-1">
                            {question.options.map((opt, optIndex) => (
                              <div
                                key={optIndex}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                                    question.answer === optIndex + 1
                                      ? "border-gray-800 bg-gray-800 text-white"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {question.answer === optIndex + 1 ? "●" : ""}
                                </span>
                                <span className="text-sm text-gray-700">
                                  {optIndex + 1}. {opt}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setIsQuestionModalOpen(true)}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
                      >
                        <FiPlus size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button type="submit">{isExam ? "시험 생성" : "과제 생성"}</Button>
            </div>
          </form>
        </Card>
      </div>

      <AddQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onAdd={handleAddQuestion}
      />
    </Page>
  );
}
