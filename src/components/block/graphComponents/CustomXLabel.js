import React from "react";
import format from "date-fns/format";

const CustomXLabel = props => {
  const { x, y, payload, bpts } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        fontSize={bpts.xs ? 10 : 11}
        textAnchor="middle"
        fill="#666"
        transform="rotate(-15)"
      >
        {format(payload.value, "MM-DD HH:00")}
      </text>
    </g>
  );
};

export default CustomXLabel;
