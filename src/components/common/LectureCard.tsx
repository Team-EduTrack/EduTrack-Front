import { Link } from "react-router-dom";

interface Props {
  name: string;
  studentCount: number;
  thumbnail?: string;
  linkTo?: string;
}

export default function LectureCard({ name, studentCount, thumbnail, linkTo }: Props) {
  const content = (
    <div className="bg-white border border-gray-200 rounded-md p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
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
          <span className="text-gray-400 text-xs">No Image</span>
        )}
      </div>
      <span className="text-base font-medium text-gray-900 flex-1">{name}</span>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-sm text-gray-500">수강생 수 :</span>
        <span className="text-lg font-semibold text-gray-900">{studentCount}</span>
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo} className="block">{content}</Link>;
  }

  return content;
}
