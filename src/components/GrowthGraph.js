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
      <div style={{ width: "100%", height: "45vh" }}>
        <ResponsiveContainer width="100%" height="100%">
          <div style={{ width: "100%", height: "100%" }}>
            <h4>Rounded Average Hourly Temperatures (˚F)</h4>
            <LineChart
              width={970}
              height={250}
              syncId="ciccio"
              data={bl.graphData}
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
              <YAxis type="number" domain={["dataMin", "dataMax"]} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip />
              <Line dataKey="Temperature" stroke="#ff7f00" dot={false} />
            </LineChart>

            <br />
            <h4>Cumulative Hourly Pollen Tube Growth (mm)</h4>
            <LineChart
              width={970}
              height={250}
              syncId="ciccio"
              data={bl.graphData}
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
              <YAxis type="number" domain={["dataMin", "dataMax"]} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip />
              <Line dataKey="cumulativeHrGrowth" stroke="#9897D8" dot={false} />
              <Line dataKey="Average Style Length" stroke="red" dot={false} />

              {bl.graphData.length >= 20 && (
                <Brush
                  tickFormatter={x => bl.graphData[x].Date}
                  height={30}
                  startIndex={0}
                />
              )}
            </LineChart>
          </div>
        </ResponsiveContainer>
      </div>
    );
  })
);

export default GrowthGraph;
