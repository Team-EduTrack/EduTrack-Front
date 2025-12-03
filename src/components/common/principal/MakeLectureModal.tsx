import { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import Button from "../Button";
import FormInput from "../Input";
import Modal from "../Modal";

interface NewLecture {
  id: number;
  name: string;
  teacher: string;
  description: string;
  days: string[];
  startDate: string;
  endDate: string;
  studentCount: number;
  averageGrade: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lecture: NewLecture) => void;
}

export default function MakeLectureModal({ isOpen, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleCreate = () => {
    if (!name || !teacher) {
      alert("강의명과 강사명을 입력해주세요.");
      return;
    }

    const newLecture = {
      id: Date.now(),
      name,
      teacher,
      description,
      days,
      startDate,
      endDate,
      studentCount: 0,
      averageGrade: 0,
    };

    onSubmit(newLecture);
    onClose();

    // 초기화
    setName("");
    setTeacher("");
    setDescription("");
    setDays([]);
    setStartDate("");
    setEndDate("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="강의 생성하기" size="lg">
      <div className="space-y-6">
        {/* 강의명 */}
        <div className="flex gap-3 items-end justify-between">
          <div className="flex-1">
            <FormInput
              label="강의명"
              placeholder="강의명을 입력하세요"
              className="w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* 담당 강사 */}
        <div className="flex gap-3 items-end justify-between">
          <div className="flex-1">
            <FormInput
              label="담당 강사"
              placeholder="강사명을 입력하세요"
              className="w-full"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            />
          </div>
          <Button type="button">찾기</Button>
        </div>

        {/* 강의 설명 */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            강의 설명
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-24 text-sm"
            placeholder="강의 설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* 강의 요일 */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            요일 선택
          </label>
          <div className="flex justify-between">
            {["월", "화", "수", "목", "금", "토"].map((day) => (
              <label
                key={day}
                className="flex items-center gap-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={days.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        {/* 시작일 ~ 종료일 */}
        <div className="flex pt-4 pb-2 gap-4">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded whitespace-nowrap">
              시작
            </span>
            <div className="relative w-full z-9999">
              <input
                type="date"
                className="input input-bordered bg-white pr-10 w-full"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onFocus={(e) => (e.target as HTMLInputElement).showPicker?.()}
              />
              <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded whitespace-nowrap">
              종료
            </span>
            <div className="relative w-full z-9999">
              <input
                type="date"
                className="input input-bordered bg-white pr-10 w-full"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onFocus={(e) => (e.target as HTMLInputElement).showPicker?.()}
              />
              <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end pt-4">
          <Button type="button" onClick={handleCreate}>
            생성하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
