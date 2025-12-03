import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  score: number; // 0~100
}

export default function ScoreDonut({ score }: Props) {
  const data = [
    { name: "score", value: score },
    { name: "rest", value: 100 - score },
  ];

  const COLORS = ["#34d399", "#e5e7eb"];

  return (
    <div className="w-full h-80 bg-base-100  flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold text-center mb-4">나의 성적</h3>

      <div className="w-[200px] h-[200px] relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-3xl font-bold text-gray-900">{score}%</p>
        </div>
      </div>
    </div>
  );
}
