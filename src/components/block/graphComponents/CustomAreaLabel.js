import React from "react";

import moment from "moment";

const CustomAreaLabel = props => {
  const { x, y, value, index, bl, bpts, unit } = props;
  const isEmergence = bl.modelDataOfSelectedDates
    .slice(1)
    .some(obj => obj.index === index);
  const isToday = moment(bl.now).isSame(bl.modelData[index].date);

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
