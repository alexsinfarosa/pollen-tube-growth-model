import React from "react";
import format from "date-fns/format";

const CustomTooltip = props => {
  const { payload, unit } = props;
  if (payload) {
    const obj = payload[0];
    return (
      <div
        style={{
          padding: 8,
          background: "white",
          border: "1px solid #ededed",
          borderRadius: 4
        }}
      >
        {obj && (
          <div>
            <div style={{ marginBottom: 8 }}>
              <b>{format(obj.payload.date, "MMM DD HH:00")}</b>
            </div>

            <div style={{ color: obj.stroke }}>
              Emergence: {obj.payload.Emergence}
              {unit}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
