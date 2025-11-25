import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  bullet?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function ListItem({ children, bullet = true, onClick, className = "" }: Props) {
  const clickableClass = onClick
    ? "cursor-pointer hover:bg-gray-50 rounded-md -mx-2 px-2"
    : "";

  return (
    <li
      className={`flex items-center py-2 text-sm text-gray-700 ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {bullet && <span className="mr-3 text-gray-300">•</span>}
      {children}
    </li>
  );
}
