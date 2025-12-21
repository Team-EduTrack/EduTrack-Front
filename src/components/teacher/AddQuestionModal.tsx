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

const initialUnits = [
  { value: "1", label: "1과 인사하기" },
  { value: "2", label: "2과 가족 소개" },
  { value: "3", label: "3과 학교생활" },
  { value: "4", label: "4과 취미 활동" },
  { value: "5", label: "5과 음식과 요리" },
];

const ADD_UNIT_VALUE = "__ADD_UNIT__";

const answerOptions = [1, 2, 3, 4, 5];
const scoreOptions = [1, 2, 3, 4, 5];
const difficultyOptions: ("상" | "중" | "하")[] = ["상", "중", "하"];

export default function AddQuestionModal({ isOpen, onClose, onAdd }: Props) {
  const [units, setUnits] = useState(initialUnits);

  const [unit, setUnit] = useState(units[0].value);
  const [answer, setAnswer] = useState(1);
  const [score, setScore] = useState(2);
  const [difficulty, setDifficulty] = useState<"상" | "중" | "하">("하");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", "", ""]);

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [newUnitLabel, setNewUnitLabel] = useState("");

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

  const handleUnitChange = (value: string) => {
    if (value === ADD_UNIT_VALUE) {
      setIsUnitModalOpen(true);
      setNewUnitLabel("");
      return;
    }
    setUnit(value);
  };

  const handleAddUnitUI = () => {
    const label = newUnitLabel.trim();
    if (!label) {
      alert("단원명을 입력해주세요.");
      return;
    }

    if (units.some((u) => u.label === label)) {
      alert("이미 존재하는 단원명입니다.");
      return;
    }

    const value = String(Date.now()); // UI용 임시 value
    setUnits((prev) => [...prev, { value, label }]);
    setUnit(value); // 방금 추가한 단원 선택
    setIsUnitModalOpen(false);
    setNewUnitLabel("");
  };

  return (
    <>
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
                onChange={(e) => handleUnitChange(e.target.value)}
              >
                {units.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
                <option disabled>──────────</option>
                <option value={ADD_UNIT_VALUE}>+ 단원 추가하기</option>
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
      <Modal
        isOpen={isUnitModalOpen}
        onClose={() => {
          setIsUnitModalOpen(false);
          setNewUnitLabel("");
        }}
        title="단원 추가"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              단원명
            </label>
            <input
              className="input input-bordered w-full bg-white"
              placeholder="예: 6과 여행 계획"
              value={newUnitLabel}
              onChange={(e) => setNewUnitLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddUnitUI();
              }}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setIsUnitModalOpen(false);
                setNewUnitLabel("");
              }}
            >
              취소
            </Button>
            <Button onClick={handleAddUnitUI}>추가</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
