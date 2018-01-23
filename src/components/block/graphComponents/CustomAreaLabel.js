import React from "react";
import isEqual from "date-fns/is_equal";

const CustomAreaLabel = props => {
  const { x, y, stroke, value, index, bl, bpts } = props;
  const isEmergence = bl.datesIdxForGraph.slice(1).some(idx => idx === index);
  const isToday = isEqual(
    new Date(bl.modelData[bl.todayIdx].date),
    new Date(bl.modelData[index].date)
  );
  if (isEmergence && x !== null && y !== null) {
    return (
      <g>
        <text
          x={x}
          y={y}
          dy={-4}
          fill={stroke}
          fontSize={bpts.xs ? 9 : 13}
          textAnchor="middle"
        >
          {value}%
        </text>
        <circle
          className={isToday ? "pulse" : null}
          cx={x}
          cy={y}
          r={isToday ? "5" : "3"}
          stroke={stroke}
        />
      </g>
    );
  }
  return null;
};

export default CustomAreaLabel;
