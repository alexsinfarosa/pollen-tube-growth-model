import React from "react";
import { inject, observer } from "mobx-react";

import CustomXLabel from "./graphComponents/CustomXLabel";
import CustomYLabel from "./graphComponents/CustomYLabel";
import CustomTooltip from "./graphComponents/CustomTooltip";

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
  observer(function HourlyTempGraph({
    app: { bStore },
    bl,
    breakpoints: bpts
  }) {
    return (
      <GraphWrapper>
        <h4>Rounded Average Hourly Temperatures (˚F)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            syncId="ciccio"
            data={bl.modelDataUpTo100}
            margin={{ top: 20, right: 20, left: -15, bottom: 20 }}
            style={{ background: "#fafafa", borderRadius: "5px" }}
          >
            <XAxis
              dataKey="Date"
              interval="preserveStart"
              axisLine={false}
              tick={<CustomXLabel bpts={bpts} />}
            />
            <YAxis
              domain={["dataMin", "dataMax"]}
              hide={false}
              axisLine={false}
              tick={<CustomYLabel bpts={bpts} unit={"˚F"} />}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip content={<CustomTooltip unit={"˚F"} />} />
            <Line dataKey="Temperature" stroke="#63a07f" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default HourlyTempGraph;
