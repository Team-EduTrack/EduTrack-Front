import { useEffect, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { useChangeStudentToTeacher } from "../../../api/generated/edutrack";

type UiUserRow = {
  id: number;
  name: string;
  userType: string; // "강사" | "학생"
  userId: string;
  phone: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  academyId: number;
  user: UiUserRow;
  onSaved: () => void; // ✅ 성공 시 부모가 refetch 하도록
}

export default function UserModal({
  isOpen,
  onClose,
  academyId,
  user,
  onSaved,
}: Props) {
  const [type, setType] = useState(user.userType);

  // 모달 열릴 때마다 user 바뀌면 select도 같이 갱신
  useEffect(() => {
    setType(user.userType);
  }, [user]);

  const changeStudentToTeacher = useChangeStudentToTeacher();

  const handleSave = () => {
    // 변경 없음 → 그냥 닫기
    if (type === user.userType) {
      onClose();
      return;
    }

    // ✅ 백엔드 API가 "학생 → 강사"만 있음
    if (user.userType === "학생" && type === "강사") {
      changeStudentToTeacher.mutate(
        { academyId, userId: user.id },
        {
          onSuccess: () => {
            onSaved(); // ✅ 부모에서 refetch
          },
          onError: () => {
            alert("역할 변경에 실패했습니다.");
          },
        }
      );
      return;
    }

    // 반대 방향은 API가 없음
    alert("현재는 '강사 → 학생' 변경 API가 없습니다.");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-6 m-3">
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <p>{user.name}</p>
        </div>

        <div className="w-60 flex flex-col gap-4">
          <select
            className="select w-full text-center"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option disabled value="">
              회원 유형을 선택하세요
            </option>
            <option value="강사">강사</option>
            <option value="학생">학생</option>
          </select>

          <div className="w-full h-12 border border-gray-300 rounded-lg px-4 flex items-center text-gray-700 bg-white">
            {user.userId}
          </div>
          <div className="w-full h-12 border border-gray-300 rounded-lg px-4 flex items-center text-gray-700 bg-white">
            {user.phone}
          </div>
        </div>

        <Button
          className="mt-2"
          onClick={handleSave}
          disabled={changeStudentToTeacher.isPending}
        >
          저장
        </Button>
      </div>
    </Modal>
  );
}
