import React from "react";
import { inject, observer } from "mobx-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { GraphWrapper } from "../../styles";

const CustomTooltip = props => {
  const { payload } = props;
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
            Temperature: {obj.payload.Temperature}˚F
          </div>
        </div>
      )}
    </div>
  );
};

const HourlyTempGraph = inject("app")(
  observer(function HourlyTempGraph({ app: { bStore }, bl }) {
    return (
      <GraphWrapper>
        <h4>Rounded Average Hourly Temperatures (˚F)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            syncId="ciccio"
            data={bl.modelData}
            margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
            style={{ background: "#fafafa", borderRadius: "5px" }}
          >
            <XAxis
              dataKey="Date"
              // domain={["dataMin", "dataMax"]}
              minTickGap={40}
              tickSize={10}
              interval="preserveStartEnd"
              axisLine={false}
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line dataKey="Temperature" stroke="#63a07f" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default HourlyTempGraph;
