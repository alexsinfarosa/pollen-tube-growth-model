import React from "react";
import { inject, observer } from "mobx-react";
import format from "date-fns/format";
import isEqual from "date-fns/is_equal";
import isAfter from "date-fns/is_after";
import isBefore from "date-fns/is_before";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  ComposedChart,
  Area,
  ReferenceLine
} from "recharts";
import { GraphWrapper } from "../../styles";

const EmergenceGraph = inject("app")(
  observer(function EmergenceGraph({ app: { bStore }, bl }) {
    const datesPlusNow = [...bl.dates, bl.now];

    const lineReference = dates =>
      dates.slice(1).map((date, c) => {
        const x = format(date, "MMM DD HA");
        const isToday = isEqual(new Date(date), new Date(bl.now));
        return (
          <ReferenceLine
            key={c}
            x={x}
            stroke="green"
            label={isToday ? "Today" : `${c + 1}˚Spray`}
          />
        );
      });

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
            <YAxis unit={"%"} hide={false} axisLine={false} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            <Tooltip />
            <Area
              type="monotone"
              dataKey={obj =>
                isAfter(obj.date, bl.now) ? obj.Emergence : null
              }
              stroke="#FFE0A9"
              fill="#FFE0A9"
            />
            <Area
              type="monotone"
              dataKey={obj =>
                isBefore(obj.date, bl.now) ? obj.Emergence : null
              }
              stroke="#FFBC42"
              fill="#FFBC42"
            />
            {lineReference(datesPlusNow)}
            {bl.modelData.length >= 20 && (
              <Brush
                style={{ borderRadius: 10 }}
                tickFormatter={x => bl.modelData[x].Date}
                height={20}
                startIndex={0}
                // endIndex={endIndex}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default EmergenceGraph;
