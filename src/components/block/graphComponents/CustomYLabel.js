import React from "react";

const CustomYLabel = props => {
  const { x, y, payload, bpts, unit } = props;
  return (
    <g>
      <text
        x={x}
        y={y}
        dy={bpts.xs ? 2 : 5}
        dx={bpts.xs ? -8 : -15}
        fontSize={bpts.xs ? 8 : 11}
        textAnchor="middle"
        fill="#666"
      >
        {payload.value}
        {unit}
      </text>
    </g>
  );
};

export default CustomYLabel;
