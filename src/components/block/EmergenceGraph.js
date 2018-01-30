import React from "react";
import { inject, observer } from "mobx-react";

import CustomXLabel from "./graphComponents/CustomXLabel";
import CustomYLabel from "./graphComponents/CustomYLabel";
import CustomTooltip from "./graphComponents/CustomTooltip";
import CustomAreaLabel from "./graphComponents/CustomAreaLabel";
import isThisYear from "date-fns/is_this_year";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area
} from "recharts";
import { GraphWrapper } from "../../styles";

const EmergenceGraph = inject("app")(
  observer(function EmergenceGraph({
    app: { filteredBlocks, bStore },
    bl,
    breakpoints: bpts
  }) {
    return (
      <GraphWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            syncId={filteredBlocks.length === 1 ? "ciccio" : null}
            data={bl.modelDataUpTo100}
            margin={{
              top: bpts.xs ? 20 : 30,
              right: bpts.xs ? 10 : 20,
              left: bpts.xs ? -30 : -15,
              bottom: bpts.xs ? 10 : 15
            }}
            style={{ background: "#fafafa", borderRadius: "5px" }}
          >
            <XAxis
              dataKey="date"
              interval={"preserveStartEnd"}
              axisLine={false}
              scale="utcTime"
              tick={<CustomXLabel bpts={bpts} />}
              padding={{ left: 5, right: 5 }}
            />
            <YAxis
              yAxisId="1"
              hide={false}
              axisLine={false}
              tick={<CustomYLabel bpts={bpts} unit={"%"} />}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            <Tooltip
              content={
                <CustomTooltip
                  bpts={bpts}
                  unit={"%"}
                  name={"Emergence"}
                  val={"emergence"}
                />
              }
            />
            {isThisYear(bl.startDate) && (
              <Area
                yAxisId="1"
                type="monotone"
                dataKey={o => (o.index <= bl.todayIdx ? o.emergence : null)}
                stroke={"#FFBC42"}
                fill={"#FFBC42"}
                label={<CustomAreaLabel bl={bl} bpts={bpts} unit={"%"} />}
              />
            )}
            {isThisYear(bl.startDate) && (
              <Area
                yAxisId="1"
                type="monotone"
                dataKey={o => (o.index >= bl.todayIdx ? o.emergence : null)}
                stroke={"#FFE0A9"}
                fill={"#FFE0A9"}
                label={<CustomAreaLabel bl={bl} bpts={bpts} unit={"%"} />}
              />
            )}
            {!isThisYear(bl.startDate) && (
              <Area
                yAxisId="1"
                type="monotone"
                dataKey={"emergence"}
                stroke={"#FFBC42"}
                fill={"#FFBC42"}
                label={<CustomAreaLabel bl={bl} bpts={bpts} unit={"%"} />}
              />
            )}
            {isThisYear(bl.startDate) &&
              !bl.isThereNow && (
                <Area
                  yAxisId="1"
                  type="monotone"
                  dataKey={"emergence"}
                  stroke={"#FFBC42"}
                  fill={"#FFBC42"}
                  label={<CustomAreaLabel bl={bl} bpts={bpts} unit={"%"} />}
                />
              )}
          </ComposedChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default EmergenceGraph;
