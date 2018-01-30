import React from "react";
import format from "date-fns/format";

const CustomTooltip = ({ payload, unit, name, val, bpts }) => {
  if (payload) {
    const obj = payload[0];
    return (
      <div
        style={{
          fontSize: bpts.xs ? 10 : 14,
          padding: bpts.xs ? 2 : 8,
          background: "white",
          border: "1px solid #ededed",
          borderRadius: 4
        }}
      >
        {obj && (
          <div>
            <div style={{ marginBottom: bpts.xs ? 2 : 8 }}>
              <b>
                {bpts.xs
                  ? format(obj.payload.date, "MM/DD HH:00")
                  : format(obj.payload.date, "MMM Do HH:00")}
              </b>
            </div>

            <div style={{ color: obj.stroke }}>
              {name}: {obj.payload[val]}
              {unit}
            </div>
            {name === "Emergence" && (
              <div style={{ marginBottom: 2 }}>
                Cumulative HrG: {obj.payload.cHrGrowth.toPrecision(3)}mm
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
};

export default CustomTooltip;
