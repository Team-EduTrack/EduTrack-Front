interface Props {
  name: string;
  level: string;
  description: string;
  thumbnail?: string;
}

export default function LectureHeader({
  name,
  level,
  description,
  thumbnail,
}: Props) {
  return (
    <div className="flex gap-6">
      <div className="w-32 h-40 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{name}</h1>
        <p className="text-sm text-gray-600 mb-4">난이도 : {level}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
