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
import { GraphWrapper } from "../../styles";

const EmergenceGraph = inject("app")(
  observer(function EmergenceGraph({ app: { bStore }, bl }) {
    return (
      <GraphWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            syncId="ciccio"
            data={bl.modelData}
            margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
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
                style={{ borderRadius: 10 }}
                tickFormatter={x => bl.modelData[x].Date}
                height={20}
                startIndex={0}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default EmergenceGraph;
