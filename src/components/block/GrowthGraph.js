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
  Brush,
  ComposedChart,
  Area
} from "recharts";

const GrowthGraph = inject("app")(
  observer(function GrowthGraph({ app: { bStore }, bl }) {
    return (
      <div style={{ width: "100%", height: "45vh" }}>
        <ResponsiveContainer width="100%" height="100%">
          <div style={{ width: "100%", height: "100%" }}>
            <h4>Rounded Average Hourly Temperatures (˚F)</h4>
            <LineChart
              width={970}
              height={250}
              syncId="ciccio"
              data={bl.modelData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip />
              <Line dataKey="Temperature" stroke="#172A3A" dot={false} />
            </LineChart>

            <br />
            <h4>Cumulative Hourly Pollen Tube Growth (mm)</h4>
            <ComposedChart
              width={970}
              height={250}
              syncId="ciccio"
              data={bl.modelData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip />
              <Line
                dataKey="Average Style Length"
                stroke="#D81159"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="Cumulative Hourly Growth"
                stroke="#48BEFF"
                fill="#48BEFF"
              />

              {bl.modelData.length >= 20 && (
                <Brush
                  tickFormatter={x => bl.modelData[x].Date}
                  height={30}
                  startIndex={0}
                />
              )}
            </ComposedChart>
          </div>
        </ResponsiveContainer>
      </div>
    );
  })
);

export default GrowthGraph;
