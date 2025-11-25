import type { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
  className?: string;
}

export default function StatBox({ label, children, className = "" }: Props) {
  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 flex items-center gap-4 ${className}`}
    >
      <span className="text-sm text-gray-700">{label}</span>
      {children}
    </div>
  );
}
