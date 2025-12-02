import { useNavigate } from "react-router-dom";
import Page from "../../components/common/Page";
import PageTitle from "../../components/common/PageTitle";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { useState } from "react";
import StatBox from "../../components/common/StatBox";

const mockExam = {
  lectureName: "영문법 심화",
  teacherName: "김은아",
  duration: 60, // 분
  questions: [
    {
      id: 1,
      content: "다음 중 문장의 주어가 올바르게 사용된 문장은?",
      choices: [
        "Me is the winner.",
        "I am the winner.",
        "Mine are the winner.",
        "My is the winner.",
        "I be the winner.",
      ],
    },
    {
      id: 2,
      content: "다음 중 과거 시제 표현이 올바른 것은?",
      choices: [
        "He go to school yesterday.",
        "He goed to school yesterday.",
        "He going to school yesterday.",
        "He went to school yesterday.",
        "He goes to school yesterday.",
      ],
    },
    {
      id: 3,
      content: "다음 중 과거 시제 표현이 올바른 것은?",
      choices: [
        "He go to school yesterday.",
        "He goed to school yesterday.",
        "He going to school yesterday.",
        "He went to school yesterday.",
        "He goes to school yesterday.",
      ],
    },
    {
      id: 4,
      content: "다음 중 과거 시제 표현이 올바른 것은?",
      choices: [
        "He go to school yesterday.",
        "He goed to school yesterday.",
        "He going to school yesterday.",
        "He went to school yesterday.",
        "He goes to school yesterday.",
      ],
    },
  ],
};

export default function ExamTakePage() {
  //const { examId } = useParams();
  const [answers, setAnswers] = useState<{ [key: number]: number | null }>({});
  const navigate = useNavigate();

  const handleSelect = (questionId: number, choiceIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceIndex,
    }));
  };

  const handleSubmit = () => {
    const confirm = window.confirm("정말 시험을 제출하시겠습니까?");
    if (!confirm) return;

    navigate("/student/tasks");
  };

  return (
    <Page>
      <PageTitle title="시험 응시" className="mb-4" />

      <Card className="space-y-4">
        <div className="grid grid-cols-3 gap-4 p-6 space-y-3 sticky top-0 bg-white z-20 shadow-md rounded-lg">
          <StatBox label="강의명">{mockExam.lectureName}</StatBox>
          <StatBox label="강사명">{mockExam.teacherName}</StatBox>
          <StatBox label="응시 시간">{mockExam.duration}분</StatBox>
        </div>

        <div className="space-y-6">
          {mockExam.questions.map((q) => (
            <Card key={q.id} className="p-6 space-y-4">
              <h2 className="font-semibold text-lg">
                {q.id}. {q.content}
              </h2>

              <div className="space-y-2">
                {q.choices.map((choice, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      className="radio"
                      checked={answers[q.id] === idx}
                      onChange={() => handleSelect(q.id, idx)}
                    />
                    <span className="text-gray-700">{choice}</span>
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
