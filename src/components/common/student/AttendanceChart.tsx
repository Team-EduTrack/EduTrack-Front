import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  myRate: number;
  classRate: number;
}

export default function AttendanceCompareChart({ myRate, classRate }: Props) {
  const data = [
    {
      name: "출석률",
      타수강생: classRate,
      나: myRate,
    },
  ];

  return (
    <div className="text-sm w-full h-83 bg-base-100 p-4 flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ left: -20 }}>
          <XAxis dataKey="name" padding={{ left: -20, right: 0 }} />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="타수강생"
            fill="#60a5fa"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          <Bar dataKey="나" fill="#34d399" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
