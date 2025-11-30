import { useState } from "react";
import Button from "../Button";
import Modal from "../Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSave: () => void;
}

export default function UserModal({ isOpen, onClose, user, onSave }: Props) {
  const [type, setType] = useState(user.userType);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-6 m-3">
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
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
            )}
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
            {user.email}
          </div>
          <div className="w-full h-12 border border-gray-300 rounded-lg px-4 flex items-center text-gray-700 bg-white">
            {user.phone}
          </div>
        </div>
        <Button
          className="mt-2"
          onClick={() => onSave({ ...user, userType: type })}
        >
          저장
        </Button>
      </div>
    </Modal>
  );
}
