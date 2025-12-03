import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  name: string;
  thumbnail?: string;
  linkTo?: string;
  children?: ReactNode;
  onClick?: () => void;
  variant?: "default" | "small" | "compact";
}

export default function LectureList({
  name,
  thumbnail,
  linkTo,
  children,
  onClick,
  variant = "default",
}: Props) {
  const styles = {
    default: {
      container: "p-5 gap-5",
      thumbnail: "w-16 h-20",
      name: "text-base",
      countSize: "text-lg",
    },
    small: {
      container: "p-3 gap-3",
      thumbnail: "w-12 h-14",
      name: "text-sm",
      countSize: "text-base",
    },
    compact: {
      container: "p-2 gap-2",
      thumbnail: "w-10 h-10",
      name: "text-xs",
      countSize: "text-sm",
    },
  }[variant];

  const content = (
    <div
      className={`bg-white border border-gray-200 rounded-md flex items-center hover:shadow-md transition-shadow ${styles.container}`}
    >
      <div
        className={`${styles.thumbnail} bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden`}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span className="text-gray-400 text-[10px] text-center leading-tight whitespace-normal break-words">
            No Image
          </span>
        )}
      </div>

      <span className={`${styles.name} font-medium text-gray-900 flex-1 ml-2`}>
        {name}
      </span>

      {children && <div className="ml-2">{children}</div>}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} onClick={onClick} className="block cursor-pointer">
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className="cursor-pointer">
      {content}
    </div>
  );

  return content;
}
