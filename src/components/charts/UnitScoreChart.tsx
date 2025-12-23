type UnitScore = {
  value: number;
  label: string;
};

export default function UnitScoreChart({
  title,
  scores,
}: {
  title: string;
  scores: UnitScore[];
}) {
  const maxScore = 100;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 text-center mb-12">
        {title}
      </h3>

      {scores.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          아직 데이터가 없습니다.
        </p>
      ) : (
        <div className="flex items-end justify-center gap-2 h-44 ">
          {scores.map((s, index) => {
            const rate = s.value ?? 0;
            return (
              <div
                key={`${s.label}-${index}`}
                className="flex flex-col items-center w-9"
              >
                <div
                  className="w-5 bg-blue-400 rounded-t transition-all hover:bg-blue-500"
                  style={{ height: `${(rate / maxScore) * 160}px` }}
                />

                <span className="text-xs text-gray-500 mt-2 text-center truncate w-full">
                  {s.label}
                </span>
                <span className="text-xs text-gray-700 font-medium">
                  {Math.round(rate)}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
