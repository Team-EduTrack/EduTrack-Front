import { useNavigate, useParams } from "react-router-dom";
import Page from "../../components/common/Page";
import PageTitle from "../../components/common/PageTitle";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { useEffect, useState } from "react";
import StatBox from "../../components/common/StatBox";
import {
  type ExamStartResponse,
  useSaveAnswers,
  useStartExam,
  useSubmitExam,
} from "../../api/generated/edutrack";
import useMyLectures from "../../hooks/student/useMyLectures";

export default function ExamTakePage() {
  const { lectureId, examId } = useParams<{
    lectureId: string;
    examId: string;
  }>();
  const { lectures } = useMyLectures();

  const lectureDetail = lectures.find((l) => l.lectureId === Number(lectureId));

  const [answers, setAnswers] = useState<{ [key: number]: number | null }>({});
  const [examData, setExamData] = useState<ExamStartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const startExamMutation = useStartExam();
  const saveAnswersMutation = useSaveAnswers();
  const submitExamMutation = useSubmitExam();

  const navigate = useNavigate();

  useEffect(() => {
    if (examId) {
      startExamMutation.mutate(
        { examId: Number(examId) },
        {
          onSuccess: (response) => {
            setExamData(response.data);
            setIsLoading(false);
          },
          onError: () => {
            setIsError(true);
            setIsLoading(false);
          },
        }
      );
    }
  }, [examId]);

  const handleSelect = (questionId: number, choiceIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceIndex,
    }));

    if (examId) {
      saveAnswersMutation.mutate({
        examId: Number(examId),
        data: {
          answers: [{ questionId, selectedAnswerNumber: choiceIndex + 1 }],
        },
      });
    }
  };

  const handleSubmit = () => {
    const confirmSubmit = window.confirm("정말 시험을 제출하시겠습니까?");
    if (!confirmSubmit) return;

    if (!examId) return;

    submitExamMutation.mutate(
      { examId: Number(examId) },
      {
        onSuccess: () => {
          alert("시험 제출이 완료되었습니다!");
          navigate("/student/tasks");
        },
        onError: () => {
          alert("시험 제출에 실패했습니다. 다시 시도해주세요.");
        },
      }
    );
  };

  if (isLoading) return <Page>시험 데이터를 불러오는 중...</Page>;

  if (isError || !examData)
    return <Page>시험 데이터를 불러오지 못했습니다.</Page>;

  return (
    <Page>
      <PageTitle title="시험 응시" className="mb-4" />

      <Card className="space-y-4">
        <div className="grid grid-cols-3 gap-4 p-6 space-y-3 sticky top-0 bg-white z-20 shadow-md rounded-lg">
          <StatBox label="강의명">{lectureDetail?.lectureTitle}</StatBox>
          <StatBox label="강사명">{lectureDetail?.teacherName}</StatBox>
          <StatBox label="응시 시간">{examData.durationMinute}분</StatBox>
        </div>

        <div className="space-y-6">
          {examData.questions?.map((q, index) => (
            <Card key={q.questionId} className="p-6 space-y-4">
              <h2 className="font-semibold text-lg">
                {index + 1}. {q.content}
              </h2>

              <div className="space-y-2">
                {q.choices?.map((choice, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${q.questionId}`}
                      className="radio"
                      checked={answers[q.questionId!] === idx}
                      onChange={() => handleSelect(q.questionId!, idx)}
                    />
                    <span className="text-gray-700">{choice.content}</span>
                  </label>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit}>시험 제출</Button>
        </div>
      </Card>
    </Page>
  );
}
