interface Props {
  value: number;
  size?: "sm" | "md";
}

const sizes = {
  sm: { svg: 48, cx: 24, r: 20, stroke: 4 },
  md: { svg: 64, cx: 32, r: 26, stroke: 5 },
};

export default function CircleProgress({ value, size = "sm" }: Props) {
  const { svg, cx, r, stroke } = sizes[size];
  const circumference = 2 * Math.PI * r;
  const offset = (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: svg, height: svg }}>
      <svg
        className="transform -rotate-90"
        style={{ width: svg, height: svg }}
      >
        <circle
          cx={cx}
          cy={cx}
          r={r}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          stroke="#374151"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${offset} ${circumference}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {value}%
      </span>
    </div>
  );
}
