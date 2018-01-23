import React from "react";

const CustomXLabel = props => {
  const { x, y, payload, bpts } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={12}
        fontSize={bpts.xs ? 8 : 11}
        textAnchor="middle"
        fill="#666"
        transform="rotate(-10)"
      >
        {payload.value}
      </text>
    </g>
  );
};

export default CustomXLabel;
