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
            data={bl.modelData}
            margin={{ top: 15, right: 0, left: -23, bottom: 15 }}
            style={{ background: "#fafafa", borderRadius: "5px" }}
          >
            <XAxis
              dataKey="date"
              // domain={["dataMin", "dataMax"]}
              minTickGap={30}
              tickSize={10}
              interval="preserveStartEnd"
              axisLine={false}
            />
            <YAxis unit="˚F" type="number" domain={["dataMin", "dataMax"]} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            {bl.modelData.length >= 20 && (
              <Brush
                tickFormatter={x => bl.modelData[x].date}
                height={30}
                startIndex={0}
              />
            )}

            <Tooltip />
            <Line dataKey="temp" stroke="#ff7f00" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  })
);

export default GrowthGraph;
