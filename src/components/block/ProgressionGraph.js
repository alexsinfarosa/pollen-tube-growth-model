import React from "react";
import { inject, observer } from "mobx-react";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  ComposedChart,
  Area
} from "recharts";

const ProgressionGraph = inject("app")(
  observer(function ProgressionGraph({ app: { bStore }, bl }) {
    return (
      <div style={{ width: "100%", height: "25vh" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={bl.modelData}
            margin={{ top: 30, right: 30, left: 0, bottom: 30 }}
            style={{ background: "white", borderRadius: "5px" }}
          >
            <XAxis
              dataKey="Date"
              // domain={["dataMin", "dataMax"]}
              minTickGap={40}
              tickSize={10}
              interval="preserveStartEnd"
              axisLine={false}
            />
            <YAxis unit={"%"} hide={false} type={"number"} axisLine={false} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            <Tooltip />
            <Area
              type="monotone"
              dataKey="Emergence"
              stroke="#FFBC42"
              fill="#FFBC42"
            />
            {bl.modelData.length >= 20 && (
              <Brush
                style={{ background: "pink" }}
                tickFormatter={x => bl.modelData[x].Date}
                height={25}
                startIndex={0}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  })
);

export default ProgressionGraph;
