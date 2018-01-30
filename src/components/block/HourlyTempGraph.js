import React from "react";
import { inject, observer } from "mobx-react";

import CustomXLabel from "./graphComponents/CustomXLabel";
import CustomYLabel from "./graphComponents/CustomYLabel";
import CustomTooltip from "./graphComponents/CustomTooltip";
import CustomAreaLabel from "./graphComponents/CustomAreaLabel";

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
      <GraphWrapper style={{ margin: "40px 0" }}>
        <h4>Rounded Average Hourly Temperatures</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            syncId="ciccio"
            data={bl.modelDataUpTo100}
            margin={{ top: 30, right: 20, left: -15, bottom: 15 }}
            style={{ background: "#fafafa", borderRadius: "5px" }}
          >
            <XAxis
              dataKey="date"
              interval={"preserveStartEnd"}
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
            <Tooltip
              content={
                <CustomTooltip
                  bpts={bpts}
                  unit={"˚F"}
                  name={"RAH Temp."}
                  val={"temperature"}
                />
              }
            />
            <Line
              dataKey="temperature"
              stroke="#63a07f"
              dot={false}
              label={
                <CustomAreaLabel
                  bl={bl}
                  bpts={bpts}
                  unit={"˚F"}
                  sIdx={bStore.startIndex}
                  eIdx={bStore.endIndex}
                />
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default HourlyTempGraph;
