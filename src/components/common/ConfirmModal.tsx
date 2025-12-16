import { useEffect, useCallback } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "확인",
  message,
  confirmText = "확인",
  cancelText = "취소",
}: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <h3 className="font-bold text-xl text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6 whitespace-pre-line">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="danger" outline className="px-8" onClick={onConfirm}>
            {confirmText}
          </Button>
          <Button variant="neutral" className="px-8" onClick={onClose}>
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
