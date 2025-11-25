interface Props {
  label: string;
  value: number | string;
  total?: number | string;
  onClick?: () => void;
  className?: string;
}

export default function Stat({ label, value, total, onClick, className = "" }: Props) {
  const clickableClass = onClick ? "cursor-pointer hover:bg-gray-100" : "";

  return (
    <div
      className={`flex items-center justify-between py-3 px-4 bg-gray-50 border border-gray-100 rounded-md ${clickableClass} ${className}`}
      onClick={onClick}
    >
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">
        {value}
        {total !== undefined && <span className="text-gray-400 font-normal"> / {total}</span>}
      </span>
    </div>
  );
}
