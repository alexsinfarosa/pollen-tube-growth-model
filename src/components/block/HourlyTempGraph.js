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
            <Tooltip />
            <Line dataKey="Temperature" stroke="#63a07f" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default HourlyTempGraph;
