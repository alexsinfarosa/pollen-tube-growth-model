import React from "react";
import isEqual from "date-fns/is_equal";

const CustomAreaLabel = props => {
  const { x, y, value, index, bl, bpts, unit, sIdx } = props;
  const indecesForGraph = bl.datesIdxForGraph.map(i => i - props.sIdx);
  const isEmergence = indecesForGraph.slice(1).some(idx => idx === index);
  const isToday = isEqual(
    new Date(bl.modelData[bl.todayIdx].date),
    new Date(bl.modelData[index + sIdx].date)
  );
  // console.log(value);
  if (isEmergence && x !== null && y !== null) {
    return (
      <g>
        <text
          x={x}
          y={y}
          dy={-10}
          fill={isToday ? "black" : "#8c8c8c"}
          fontSize={bpts.xs ? 9 : isToday ? 16 : 12}
          textAnchor="middle"
        >
          {unit === "mm" ? value.toPrecision(2) : value}
          {unit}
        </text>
        <circle
          className={isToday ? "pulse" : null}
          cx={x}
          cy={y}
          r={isToday ? "16" : "3"}
          stroke={"#8c8c8c"}
          fill={"#8c8c8c"}
        />
      </g>
    );
  }
  return null;
};

export default CustomAreaLabel;
