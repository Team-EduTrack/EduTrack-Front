interface UnitScoreChartProps {
  title: string;
  scores: { name?: string; value: number }[];
  maxScore?: number;
  barColor?: string;
}

export default function UnitScoreChart({
  title,
  scores,
  maxScore = 100,
  barColor = "#3b82f6",
}: UnitScoreChartProps) {
  return (
    <div className="bg-base-100 p-4 rounded-lg shadow">
      <h3 className="text-sm font-semibold text-center mb-4">{title}</h3>
      <div className="flex items-end justify-center gap-3 h-44">
        {scores.map((score, idx) => (
          <div
            key={idx}
            className="w-10 rounded-t transition-all hover:brightness-110"
            style={{
              height: `${(score.value / maxScore) * 160}px`,
              backgroundColor: barColor,
            }}
            title={`${score.name}: ${score.value}%`}
          />
        ))}
      </div>
    </div>
  );
}
