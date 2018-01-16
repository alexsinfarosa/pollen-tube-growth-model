import React from "react";
import { inject, observer } from "mobx-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush
} from "recharts";

const GrowthGraph = inject("app")(
  observer(function GrowthGraph({ app: { bStore }, bl }) {
    return (
      <div style={{ width: "100%", height: "35vh" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={bl.graphData}
            margin={{ top: 15, right: 0, left: -23, bottom: 15 }}
            style={{ background: "#fafafa", borderRadius: "5px" }}
          >
            <XAxis
              dataKey="Date"
              // domain={["dataMin", "dataMax"]}
              minTickGap={30}
              tickSize={10}
              interval="preserveStartEnd"
              axisLine={false}
            />
            <YAxis unit="˚F" type="number" domain={["dataMin", "dataMax"]} />
            <YAxis dataKey="Percentage" orientation="right" />

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            {bl.graphData.length >= 20 && (
              <Brush
                tickFormatter={x => bl.graphData[x].Date}
                height={30}
                startIndex={0}
              />
            )}

            <Tooltip />
            <Line dataKey="Temperature" stroke="#ff7f00" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  })
);

export default GrowthGraph;
