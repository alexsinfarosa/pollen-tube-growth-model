import React from "react";
import { inject, observer } from "mobx-react";
import isAfter from "date-fns/is_after";
import isBefore from "date-fns/is_before";
import addHours from "date-fns/add_hours";
import subHours from "date-fns/sub_hours";

import CustomXLabel from "./graphComponents/CustomXLabel";
import CustomYLabel from "./graphComponents/CustomYLabel";
import CustomTooltip from "./graphComponents/CustomTooltip";
import CustomAreaLabel from "./graphComponents/CustomAreaLabel";

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
  observer(function CumulativeGrowthGraph({
    app: { bStore },
    bl,
    breakpoints: bpts
  }) {
    return (
      <GraphWrapper style={{ margin: "40px 0" }}>
        <h4>Cumulative Hourly Pollen Tube Growth</h4>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            syncId="ciccio"
            data={bl.modelDataUpTo100}
            margin={{ top: 30, right: 20, left: -15, bottom: 15 }}
            style={{ background: "#fafafa", borderRadius: "5px" }}
          >
            <XAxis
              dataKey="Date"
              interval="preserveStart"
              axisLine={false}
              tick={<CustomXLabel bpts={bpts} />}
            />
            <YAxis
              hide={false}
              axisLine={false}
              tick={<CustomYLabel bpts={bpts} unit={"mm"} />}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip
              content={
                <CustomTooltip
                  unit={"mm"}
                  name={"Cumulative HPTG"}
                  val={"Cumulative Hourly Growth"}
                />
              }
            />
            <Line dataKey="Average Style Length" stroke="#8D6A9F" dot={false} />
            <Area
              type="monotone"
              dataKey={obj =>
                isBefore(new Date(obj.date), new Date(addHours(bl.now, 1)))
                  ? obj["Cumulative Hourly Growth"]
                  : null
              }
              stroke="#8D6A9F"
              fill="#8D6A9F"
              label={
                <CustomAreaLabel
                  bl={bl}
                  bpts={bpts}
                  unit={"mm"}
                  sIdx={bStore.startIndex}
                  eIdx={bStore.endIndex}
                />
              }
            />

            <Area
              type="monotone"
              dataKey={obj =>
                isAfter(new Date(obj.date), new Date(subHours(bl.now, 1)))
                  ? obj["Cumulative Hourly Growth"]
                  : null
              }
              stroke="#CBBBD3"
              fill="#CBBBD3"
              label={
                <CustomAreaLabel
                  bl={bl}
                  bpts={bpts}
                  unit={"mm"}
                  sIdx={bStore.startIndex}
                  eIdx={bStore.endIndex}
                />
              }
            />
          </ComposedChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default CumulativeGrowthGraph;
