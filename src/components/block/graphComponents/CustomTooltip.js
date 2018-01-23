import React from "react";

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
              <b>{obj.payload.date}</b>
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
