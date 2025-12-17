import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { useAvailableStudents } from "../../hooks/teacher";
import type { StudentSearchResponse } from "../../api/generated/edutrack";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (studentIds: number[]) => void;
  lectureId: number;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  onAdd,
  lectureId,
}: Props) {
  const [searchName, setSearchName] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<StudentSearchResponse[]>([]);

  const { availableStudents, isLoading } = useAvailableStudents(
    lectureId,
    debouncedName
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(searchName);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchName]);

  const handleSelectStudent = (student: StudentSearchResponse) => {
    if (selectedStudents.some((s) => s.studentId === student.studentId)) {
      setSelectedStudents((prev) =>
        prev.filter((s) => s.studentId !== student.studentId)
      );
    } else {
      setSelectedStudents((prev) => [...prev, student]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStudents.length === 0) {
      alert("추가할 학생을 선택해주세요.");
      return;
    }

    const studentIds = selectedStudents
      .map((s) => s.studentId)
      .filter((id): id is number => id !== undefined);

    onAdd(studentIds);
    handleClose();
  };

  const handleClose = () => {
    setSearchName("");
    setDebouncedName("");
    setSelectedStudents([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h3 className="font-bold text-xl mb-6 text-center text-gray-900">
        학생 추가
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="학생 검색"
          name="search"
          placeholder="학생 이름을 입력하세요"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        {/* 검색 결과 */}
        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <span className="loading loading-spinner loading-sm"></span>
            </div>
          ) : debouncedName && availableStudents.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              검색 결과가 없습니다.
            </p>
          ) : debouncedName ? (
            <ul className="divide-y divide-gray-100">
              {availableStudents.map((student) => (
                <li
                  key={student.studentId}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                    selectedStudents.some((s) => s.studentId === student.studentId)
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onClick={() => handleSelectStudent(student)}
                >
                  <span className="text-sm text-gray-700">{student.name}</span>
                  {selectedStudents.some((s) => s.studentId === student.studentId) && (
                    <span className="text-blue-600 text-sm">✓</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              학생 이름을 입력하여 검색하세요.
            </p>
          )}
        </div>

        {/* 선택된 학생 */}
        {selectedStudents.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-2">
              선택된 학생 ({selectedStudents.length}명)
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedStudents.map((student) => (
                <span
                  key={student.studentId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {student.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectStudent(student);
                    }}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            취소
          </Button>
          <Button type="submit" disabled={selectedStudents.length === 0}>
            추가 ({selectedStudents.length}명)
          </Button>
        </div>
      </form>
    </Modal>
  );
}
