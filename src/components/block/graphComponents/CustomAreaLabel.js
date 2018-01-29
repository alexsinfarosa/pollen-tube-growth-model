import React from "react";
import isEqual from "date-fns/is_equal";

const CustomAreaLabel = props => {
  const { x, y, value, index, bl, bpts, unit } = props;

  const indecesForGraph = bl.datesIdxForGraph.map(i => i);
  const isEmergence = indecesForGraph.some(idx => idx === index);
  const isToday = isEqual(new Date(bl.now), new Date(bl.modelData[index].date));

  if (isEmergence && x !== null && y !== null) {
    return (
      <g>
        <text
          x={x}
          y={y}
          dy={-10}
          fill={isToday ? "black" : "#8c8c8c"}
          fontSize={bpts.xs ? 12 : isToday ? 16 : 12}
          textAnchor="middle"
        >
          {unit === "mm" ? value.toPrecision(2) : value}
          {unit}
        </text>
        <circle
          // className={isToday ? "pulse" : null}
          cx={x}
          cy={y}
          r={isToday ? "4" : "3"}
          stroke={isToday ? "black" : "#8c8c8c"}
          fill={isToday ? "black" : "#8c8c8c"}
        />
      </g>
    );
  }
  return null;
};

export default CustomAreaLabel;
