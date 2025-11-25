import { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

interface Student {
  id: number;
  name: string;
  attendanceRate: string;
  assignmentSubmitted: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (student: Student) => void;
  existingStudents: Student[];
}

export default function AddStudentModal({
  isOpen,
  onClose,
  onAdd,
  existingStudents,
}: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("학생 이름을 입력해주세요.");
      return;
    }

    if (existingStudents.some((s) => s.name === name.trim())) {
      setError("이미 등록된 학생입니다.");
      return;
    }

    const newStudent: Student = {
      id: Date.now(),
      name: name.trim(),
      attendanceRate: "0%",
      assignmentSubmitted: false,
    };

    onAdd(newStudent);
    setName("");
    setError("");
  };

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h3 className="font-bold text-xl mb-6 text-center text-gray-900">
        학생 추가
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="학생 이름"
          name="name"
          placeholder="학생 이름을 입력하세요"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          error={error}
          required
        />
        <div className="flex justify-center gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            취소
          </Button>
          <Button type="submit">추가</Button>
        </div>
      </form>
    </Modal>
  );
}
