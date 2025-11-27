import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";

export interface PieDataItem {
  name: string;
  value: number;
}

interface Props {
  data: PieDataItem[];
  width?: number | string;
  height?: number | string;
  showLegend?: boolean;
  legendFormatter?: (entry: PieDataItem) => string;
  innerRadius?: number | string;
  outerRadius?: number | string;
  className?: string;
}

const DEFAULT_COLORS = ["#e5e7eb", "#374151"];

export default function ReusablePieChart({
  data,
  width = "100%",
  height = "100%",
  showLegend = true,
  legendFormatter,
  innerRadius = "35%",
  outerRadius = "65%",
  className = "",
}: Props) {
  const coloredData = data.map((item, idx) => ({
    ...item,
    fill: item.fill || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
  }));

  return (
    <div className={`w-full min-w-[120px] h-32 ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        <PieChart>
          {showLegend && (
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconSize={10}
              wrapperStyle={{ paddingLeft: 16 }}
              payload={coloredData.map((d) => ({
                value: legendFormatter
                  ? legendFormatter(d)
                  : `${d.name} ${d.value}`,
                type: "square",
                color: d.fill,
              }))}
            />
          )}

          <Pie
            data={coloredData}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            cx="50%"
            cy="45%"
          />

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
