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
  observer(function EmergenceGraph({
    app: { filteredBlocks, bStore },
    bl,
    breakpoints: bpts
  }) {
    return (
      <GraphWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            syncId={filteredBlocks.length === 1 && !bpts.xs ? "ciccio" : null}
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
              dataKey="Date"
              interval="preserveStart"
              axisLine={false}
              tick={<CustomXLabel bpts={bpts} />}
              padding={{ left: 5, right: 5 }}
            />
            <YAxis
              hide={false}
              axisLine={false}
              tick={<CustomYLabel bpts={bpts} unit={"%"} />}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            <Tooltip
              content={
                <CustomTooltip
                  unit={"%"}
                  name={"Emergence"}
                  val={"Emergence"}
                />
              }
            />
            <Area
              type="monotone"
              dataKey={obj =>
                isBefore(new Date(obj.date), new Date(addHours(bl.now, 1)))
                  ? obj.Emergence
                  : null
              }
              stroke="#FFBC42"
              fill="#FFBC42"
              label={
                <CustomAreaLabel
                  bl={bl}
                  bpts={bpts}
                  unit={"%"}
                  sIdx={bStore.startIndex}
                  eIdx={bStore.endIndex}
                />
              }
            />
            <Area
              type="monotone"
              dataKey={obj =>
                isAfter(new Date(obj.date), new Date(subHours(bl.now, 1)))
                  ? obj.Emergence
                  : null
              }
              stroke="#FFE0A9"
              fill="#FFE0A9"
              label={
                <CustomAreaLabel
                  bl={bl}
                  bpts={bpts}
                  unit={"%"}
                  sIdx={bStore.startIndex}
                  eIdx={bStore.endIndex}
                />
              }
            />
            {filteredBlocks.length === 1 &&
              !bpts.xs && (
                <Brush
                  data={bl.modelDataUpTo100}
                  stroke="#63A07F"
                  tickFormatter={x => bl.modelData[x].date}
                  height={bpts.xs ? 15 : 20}
                  onChange={e => bStore.setRange(e)}
                />
              )}
          </ComposedChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default EmergenceGraph;
