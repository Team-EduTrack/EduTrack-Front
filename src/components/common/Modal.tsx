import { ReactNode } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({ isOpen, onClose, children, size = "md" }: Props) {
  if (!isOpen) return null;

  const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };

  return (
    <div className="modal modal-open">
      <div className={`modal-box ${sizes[size]} bg-white p-0 rounded-2xl shadow-xl`}>
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 hover:bg-gray-100"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="p-8">{children}</div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
    </div>
  );
}
