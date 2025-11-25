import type { ReactNode } from "react";

interface Props {
  label: string;
  value?: ReactNode;
  action?: ReactNode;
}

export default function ScoreBox({ label, value, action }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      {value && (
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      )}
      {action}
    </div>
  );
}
