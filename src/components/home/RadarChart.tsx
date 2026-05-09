"use client";

import React from "react";
import {
  type BaseTickContentProps,
  Customized,
  PolarAngleAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  useChartHeight,
  useChartWidth,
} from "recharts";

import { RadarCategory, RadarChartData } from "@/data/radarchart";

const CATEGORIES: { key: RadarCategory; label: string }[] = [
  { key: "DISCOVERY_ANALYSIS", label: "발견/분석" },
  { key: "REFLECTION_GROWTH", label: "성찰/성장" },
  { key: "COLLABORATION", label: "협업/조율" },
  { key: "PROBLEM_SOLVING", label: "문제해결/개선" },
  { key: "PLANNING_EXECUTION", label: "기획/실행" },
];

const COUNT = CATEGORIES.length;
const CHART_MARGIN = 5;
const OUTER_RADIUS_PERCENT = 72;
const INNER_RATIO = 0.6;
const GRID_RATIOS = [0.33, 0.66, 1.0];
const AXIS_TICK_INSET = 8;
const AXIS_TICK_GAP = 8;
const AXIS_STROKE = "var(--gray-700, #999)";
const AXIS_STROKE_WIDTH = 0.6;

// 위쪽(−90°)부터 시계방향으로 각도 계산
const axisAngle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / COUNT;
const notchAngle = (i: number) => -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / COUNT;

interface Point {
  x: number;
  y: number;
}

const INNER_CORNER_ROUNDING = 0.05;
const OUTER_RADIUS = `${OUTER_RADIUS_PERCENT}%`;

const buildStarPoints = (cx: number, cy: number, outerR: number, innerR: number) => ({
  outerPts: Array.from({ length: COUNT }, (_, i) => ({
    x: cx + outerR * Math.cos(axisAngle(i)),
    y: cy + outerR * Math.sin(axisAngle(i)),
  })),
  notchPts: Array.from({ length: COUNT }, (_, i) => ({
    x: cx + innerR * Math.cos(notchAngle(i)),
    y: cy + innerR * Math.sin(notchAngle(i)),
  })),
});

const getResponsiveOuterRadius = (width: number, height: number) =>
  (Math.max(0, Math.min(width - CHART_MARGIN * 2, height - CHART_MARGIN * 2)) / 2) *
  (OUTER_RADIUS_PERCENT / 100);

const moveToward = (from: Point, to: Point, distance: number): Point => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;

  return {
    x: from.x + (dx / length) * distance,
    y: from.y + (dy / length) * distance,
  };
};

function roundedInnerStarPath(
  outerPts: { x: number; y: number }[],
  notchPts: { x: number; y: number }[],
): string {
  const n = outerPts.length;
  const d: string[] = [`M ${outerPts[0].x},${outerPts[0].y}`];

  for (let i = 0; i < n; i++) {
    const outer = outerPts[i];
    const notch = notchPts[i];
    const next = outerPts[(i + 1) % n];
    const inLength = Math.hypot(notch.x - outer.x, notch.y - outer.y);
    const outLength = Math.hypot(next.x - notch.x, next.y - notch.y);
    const rounding = Math.min(inLength, outLength) * INNER_CORNER_ROUNDING;
    const curveStart = moveToward(notch, outer, rounding);
    const curveEnd = moveToward(notch, next, rounding);

    d.push(`L ${curveStart.x},${curveStart.y}`);
    d.push(`Q ${notch.x},${notch.y} ${curveEnd.x},${curveEnd.y}`);
    d.push(`L ${next.x},${next.y}`);
  }

  return d.join(" ") + " Z";
}

// Customized 내부에서 recharts 훅으로 실제 cx/cy 계산
const StarGrid = () => {
  const width = useChartWidth() ?? 0;
  const height = useChartHeight() ?? 0;
  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = getResponsiveOuterRadius(width, height);

  return (
    <g>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* bg-cta-gradient와 동일한 색상을 SVG radialGradient로 정의 */}
        <radialGradient
          id="radarFill"
          cx="14.37%"
          cy="11%"
          r="135%"
          gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="var(--color-offwhite-100, #fefefe)" />
          <stop offset="19.71%" stopColor="#bcfff6" />
          <stop offset="38.46%" stopColor="var(--color-sea-blue-300, #aefaff)" />
          <stop offset="57.69%" stopColor="#dffdff" />
          <stop offset="77.4%" stopColor="#c0fcff" />
          <stop offset="97.12%" stopColor="#26eaf1" />
        </radialGradient>
      </defs>

      {/* 별 모양 격자 */}
      {GRID_RATIOS.map((ratio, i) => {
        const { outerPts, notchPts } = buildStarPoints(
          cx,
          cy,
          outerRadius * ratio,
          outerRadius * ratio * INNER_RATIO,
        );

        return (
          <path
            key={i}
            d={roundedInnerStarPath(outerPts, notchPts)}
            fill="none"
            stroke={AXIS_STROKE}
            strokeWidth={AXIS_STROKE_WIDTH}
          />
        );
      })}

      {/* 바깥 꼭짓점 축선 */}
      {Array.from({ length: COUNT }, (_, i) => (
        <line
          key={`a${i}`}
          x1={cx}
          y1={cy}
          x2={cx + outerRadius * Math.cos(axisAngle(i))}
          y2={cy + outerRadius * Math.sin(axisAngle(i))}
          stroke={AXIS_STROKE}
          strokeWidth={AXIS_STROKE_WIDTH}
        />
      ))}
    </g>
  );
};

// outer point는 뾰족하게, notch를 control point로 하는 Q bezier로 안쪽만 곡선
function sharpTipStarPath(
  outerPts: { x: number; y: number }[],
  notchPts: { x: number; y: number }[],
): string {
  const n = outerPts.length;
  const d: string[] = [`M ${outerPts[0].x},${outerPts[0].y}`];
  for (let i = 0; i < n; i++) {
    const notch = notchPts[i];
    const next = outerPts[(i + 1) % n];
    d.push(`Q ${notch.x},${notch.y} ${next.x},${next.y}`);
  }
  return d.join(" ") + " Z";
}

interface StarShapeProps {
  points?: { x: number; y: number }[];
}

type AxisTickProps = BaseTickContentProps;

function AxisTickInner({ x = 0, y = 0, textAnchor, payload }: AxisTickProps) {
  const width = useChartWidth() ?? 0;
  const height = useChartHeight() ?? 0;
  const cx = width / 2;
  const cy = height / 2;
  const baseX = typeof x === "number" ? x : Number(x);
  const baseY = typeof y === "number" ? y : Number(y);
  const dx = baseX - cx;
  const dy = baseY - cy;
  const distance = Math.hypot(dx, dy) || 1;
  const radialOffsetX = (dx / distance) * AXIS_TICK_GAP;
  const radialOffsetY = (dy / distance) * AXIS_TICK_GAP;
  const insetX =
    textAnchor === "start" ? -AXIS_TICK_INSET : textAnchor === "end" ? AXIS_TICK_INSET : 0;
  const finalX = Math.round(baseX + radialOffsetX + insetX);
  const finalY = Math.round(baseY + radialOffsetY);

  return (
    <text
      x={finalX}
      y={finalY}
      textAnchor={textAnchor}
      dominantBaseline="central"
      textRendering="geometricPrecision"
      className="body-4 text-gray-400"
      fill="var(--color-gray-400, #dddddd)">
      {payload?.value}
    </text>
  );
}

const AxisTick = React.memo(AxisTickInner);
AxisTick.displayName = "AxisTick";

const renderAxisTick = (props: AxisTickProps) => <AxisTick {...props} />;

const StarShape = ({ points = [] }: StarShapeProps) => {
  const width = useChartWidth() ?? 0;
  const height = useChartHeight() ?? 0;
  const cx = width / 2;
  const cy = height / 2;

  if (points.length === 0) return null;

  const outerPts = points.map(p => ({ x: p.x, y: p.y }));
  const notchPts = points.map((p, i) => {
    const next = points[(i + 1) % points.length];
    const pAngle = Math.atan2(p.y - cy, p.x - cx);
    const nAngle = Math.atan2(next.y - cy, next.x - cx);
    let diff = nAngle - pAngle;
    if (diff > Math.PI) diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;
    const midAngle = pAngle + diff / 2;
    const innerR =
      ((Math.hypot(p.x - cx, p.y - cy) + Math.hypot(next.x - cx, next.y - cy)) / 2) * INNER_RATIO;
    return { x: cx + innerR * Math.cos(midAngle), y: cy + innerR * Math.sin(midAngle) };
  });

  return (
    <g>
      <path
        className="radar-polygon"
        d={sharpTipStarPath(outerPts, notchPts)}
        fill="url(#radarFill)"
        stroke="none"
        filter="url(#glow)"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--color-sea-blue-400, #68eff7)" />
      ))}
    </g>
  );
};

interface RadarChartProps {
  data: RadarChartData;
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const { max, categories } = data;

  const chartData = CATEGORIES.map(({ key, label }) => ({
    subject: label,
    value: categories[key],
    fullMark: max,
  }));

  return (
    <ResponsiveContainer width="100%" height={300} style={{ userSelect: "none" }}>
      <RechartsRadarChart
        data={chartData}
        margin={{
          top: CHART_MARGIN,
          right: CHART_MARGIN,
          bottom: CHART_MARGIN,
          left: CHART_MARGIN,
        }}
        cx="50%"
        cy="50%"
        outerRadius={OUTER_RADIUS}
        startAngle={90}
        endAngle={-270}
        style={{ pointerEvents: "none" }}>
        <Customized component={StarGrid} />
        <PolarAngleAxis dataKey="subject" tick={renderAxisTick} />
        <Radar dataKey="value" shape={<StarShape />} dot={false} activeDot={false} />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;
