import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

interface Props {
  title?: string;
  moreLink?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, moreLink, children, className = "" }: Props) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {moreLink && (
            <Link
              to={moreLink}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              더보기
              <FiChevronRight size={14} />
            </Link>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
