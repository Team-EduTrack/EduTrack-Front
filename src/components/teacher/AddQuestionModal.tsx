import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";

interface QuestionData {
  id: number;
  unit: string;
  unitId: number;
  answer: number;
  score: number;
  difficulty: "상" | "중" | "하";
  question: string;
  options: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (question: QuestionData) => void;
}

const units = [
  { value: "1", label: "1과 인사하기" },
  { value: "2", label: "2과 가족 소개" },
  { value: "3", label: "3과 학교생활" },
  { value: "4", label: "4과 취미 활동" },
  { value: "5", label: "5과 음식과 요리" },
];

const answerOptions = [1, 2, 3, 4, 5];
const scoreOptions = [1, 2, 3, 4, 5];
const difficultyOptions: ("상" | "중" | "하")[] = ["상", "중", "하"];

export default function AddQuestionModal({ isOpen, onClose, onAdd }: Props) {
  const [unit, setUnit] = useState(units[0].value);
  const [answer, setAnswer] = useState(1);
  const [score, setScore] = useState(2);
  const [difficulty, setDifficulty] = useState<"상" | "중" | "하">("하");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", "", ""]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const resetForm = () => {
    setUnit(units[0].value);
    setAnswer(1);
    setScore(2);
    setDifficulty("하");
    setQuestion("");
    setOptions(["", "", "", "", ""]);
  };

  const handleSubmit = () => {
    if (!question.trim()) {
      alert("문제를 입력해주세요.");
      return;
    }

    const filledOptions = options.filter((opt) => opt.trim());
    if (filledOptions.length < 2) {
      alert("최소 2개 이상의 보기를 입력해주세요.");
      return;
    }

    onAdd({
      id: Date.now(),
      unit: units.find((u) => u.value === unit)?.label || unit,
      unitId: Number(unit),
      answer,
      score,
      difficulty,
      question,
      options: filledOptions,
    });

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="문제 추가" size="lg">
      <div className="space-y-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              단원 선택
            </span>
            <select
              className="select select-bordered select-sm bg-white"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              {units.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">정답</span>
            <select
              className="select select-bordered select-sm bg-white w-16"
              value={answer}
              onChange={(e) => setAnswer(Number(e.target.value))}
            >
              {answerOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">배점</span>
            <select
              className="select select-bordered select-sm bg-white w-16"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
            >
              {scoreOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">난이도</span>
            <select
              className="select select-bordered select-sm bg-white w-16"
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as "상" | "중" | "하")
              }
            >
              {difficultyOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            문제 입력
          </label>
          <textarea
            className="w-full h-24 p-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
            placeholder="다음 중 옳은 정답을 고르시오.&#10;Lorem ipsum dolor sit amet..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            객관식 보기 입력
          </label>
          <div className="space-y-2">
            {options.map((opt, index) => (
              <input
                key={index}
                type="text"
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
                placeholder={`${index + 1}번`}
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-gray-100">
          <Button onClick={handleSubmit}>생성하기</Button>
        </div>
      </div>
    </Modal>
  );
}
