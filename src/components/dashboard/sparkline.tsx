interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

/** เส้นแนวโน้มย่อส่วน (Stephen Few) — วาดด้วย SVG ล้วน ไม่มีแกน/กริด ตามหลัก Data-Ink Ratio */
export function Sparkline({ data, color = "var(--primary)", height = 30 }: SparklineProps) {
  const width = 140;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - 2 - ((value - min) / range) * (height - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-[140px] overflow-visible"
      style={{ height }}
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
