import type { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
  className?: string;
}

export default function StatBox({ label, children, className = "" }: Props) {
  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 flex justify-center items-center text-center ${className}`}
    >
      <span className="text-sm text-gray-600 font-semibold mr-4">{label}</span>
      <span className="text-xl font-bold text-gray-900">{children}</span>
    </div>
  );
}
