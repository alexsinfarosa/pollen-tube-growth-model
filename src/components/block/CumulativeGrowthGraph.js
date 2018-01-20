import React from "react";
import { inject, observer } from "mobx-react";

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area
} from "recharts";
import { GraphWrapper } from "../../styles";

const CumulativeGrowthGraph = inject("app")(
  observer(function CumulativeGrowthGraph({ app: { bStore }, bl }) {
    return (
      <GraphWrapper>
        <h4>Cumulative Hourly Pollen Tube Growth (mm)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
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
            <Line dataKey="Average Style Length" stroke="#D81159" dot={false} />
            <Area
              type="monotone"
              dataKey="Cumulative Hourly Growth"
              stroke="#48BEFF"
              fill="#48BEFF"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default CumulativeGrowthGraph;
