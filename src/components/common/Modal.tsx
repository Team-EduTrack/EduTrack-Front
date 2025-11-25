import type { ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg";
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
}: Props) {
  if (!isOpen) return null;

  const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className={`relative bg-white ${sizes[size]} w-full mx-4 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto`}
      >
        {title ? (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </>
        ) : (
          <>
            <button
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={onClose}
            >
              <FiX size={20} />
            </button>
            <div className="p-8">{children}</div>
          </>
        )}
      </div>
    </div>
  );
}
