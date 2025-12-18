import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { FiPlus } from "react-icons/fi";
import Page from "../../components/common/Page";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import AddQuestionModal from "../../components/teacher/AddQuestionModal";
import { authState } from "../../stores/authStore";
import {
  useTeacherLectures,
  useCreateExam,
  useCreateAssignment,
  useRegisterQuestions,
} from "../../hooks/teacher";
import type { QuestionRegistrationRequest } from "../../api/generated/edutrack";

type TabType = "exam" | "assignment";

interface Question {
  id: number;
  unit: string;
  unitId: number;
  answer: number;
  score: number;
  difficulty: "상" | "중" | "하";
  question: string;
  options: string[];
}

export default function ExamManagement() {
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);
  const academyId = auth.user?.academy?.id ?? 0;

  const { lectures, isLoading: isLoadingLectures } = useTeacherLectures();
  const { createExam, isPending: isCreatingExam } = useCreateExam();
  const { createAssignment, isPending: isCreatingAssignment } =
    useCreateAssignment();
  const { registerQuestions, isPending: isRegisteringQuestions } =
    useRegisterQuestions();

  const [activeTab, setActiveTab] = useState<TabType>("exam");
  const [selectedLecture, setSelectedLecture] = useState<number>(0);
  const [examName, setExamName] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [durationMinute, setDurationMinute] = useState<number>(30);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // 첫 번째 강의 선택
  useState(() => {
    if (lectures.length > 0 && selectedLecture === 0) {
      setSelectedLecture(lectures[0].lectureId ?? 0);
    }
  });

  const selectedLectureName =
    lectures.find((l) => l.lectureId === selectedLecture)?.title || "";
  const isExam = activeTab === "exam";
  const isSubmitting = isCreatingExam || isCreatingAssignment || isRegisteringQuestions;

  const handleAddQuestion = (question: Question) => {
    setQuestions((prev) => [...prev, question]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLecture) {
      alert("강의를 선택해주세요.");
      return;
    }

    if (!examName.trim()) {
      alert(isExam ? "시험명을 입력해주세요." : "과제명을 입력해주세요.");
      return;
    }

    if (!startDate || !endDate) {
      alert("기간을 설정해주세요.");
      return;
    }

    try {
      if (isExam) {
        // 시험 생성
        const examResult = await createExam({
          lectureId: selectedLecture,
          data: {
            lectureId: selectedLecture,
            title: examName,
            description: assignmentDescription || undefined,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            durationMinute,
          },
        });

        const examId = examResult.data?.examId;

        // 문제 등록
        if (examId && questions.length > 0) {
          const questionRequests: QuestionRegistrationRequest[] = questions.map(
            (q) => ({
              questionText: q.question,
              choices: q.options,
              correctAnswerIndex: q.answer - 1, // 0-based index
              difficulty:
                q.difficulty === "상"
                  ? "HARD"
                  : q.difficulty === "중"
                    ? "MEDIUM"
                    : "EASY",
              unitId: q.unitId || 1,
            })
          );

          await registerQuestions({
            lectureId: selectedLecture,
            examId,
            data: questionRequests,
          });
        }

        alert("시험이 생성되었습니다.");
      } else {
        // 과제 생성
        await createAssignment({
          academyId,
          lectureId: selectedLecture,
          data: {
            lectureId: selectedLecture,
            title: examName,
            description: assignmentDescription || undefined,
            dueDate: new Date(endDate).toISOString(),
          },
        });

        alert("과제가 생성되었습니다.");
      }

      navigate(-1);
    } catch (error) {
      console.error("Failed to create:", error);
      alert(isExam ? "시험 생성에 실패했습니다." : "과제 생성에 실패했습니다.");
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

  if (isLoadingLectures) {
    return (
      <Page>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Page>
    );
  }

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
              {lectures.length === 0 ? (
                <p className="text-sm text-gray-500">등록된 강의가 없습니다.</p>
              ) : (
                <select
                  className="select select-bordered w-full max-w-md bg-white"
                  value={selectedLecture}
                  onChange={(e) => setSelectedLecture(Number(e.target.value))}
                >
                  <option value={0}>강의를 선택하세요</option>
                  {lectures.map((lecture) => (
                    <option key={lecture.lectureId} value={lecture.lectureId}>
                      {lecture.title}
                    </option>
                  ))}
                </select>
              )}
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
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded whitespace-nowrap">
                    시작
                  </span>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      className="input input-bordered bg-white"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded whitespace-nowrap">
                    종료
                  </span>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      className="input input-bordered bg-white"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {isExam && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  응시 시간 (분)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    className="input input-bordered w-32 bg-white"
                    value={durationMinute}
                    onChange={(e) => setDurationMinute(Number(e.target.value))}
                  />
                  <span className="text-sm text-gray-600">분</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">최소 5분 이상 설정해주세요.</p>
              </div>
            )}

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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "생성 중..."
                  : isExam
                    ? "시험 생성"
                    : "과제 생성"}
              </Button>
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
