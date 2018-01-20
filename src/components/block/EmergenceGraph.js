import React from "react";
import { inject, observer } from "mobx-react";
import format from "date-fns/format";
import isAfter from "date-fns/is_after";
import isEqual from "date-fns/is_equal";
import isBefore from "date-fns/is_before";
import addHours from "date-fns/add_hours";
import subHours from "date-fns/sub_hours";

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

const CustomTooltip = props => {
  const { payload } = props;
  const obj = payload[0];
  return (
    <div
      style={{
        padding: 8,
        background: "white",
        border: "1px solid #ededed",
        borderRadius: 4
      }}
    >
      {obj && (
        <div>
          <div style={{ marginBottom: 8 }}>
            <b>{obj.payload.date}</b>
          </div>

          <div style={{ color: obj.stroke }}>
            Emergence: {obj.payload.Emergence}%
          </div>
        </div>
      )}
    </div>
  );
};

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
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={obj =>
                isBefore(new Date(obj.date), new Date(addHours(bl.now, 1)))
                  ? obj.Emergence
                  : null
              }
              stroke="#FFBC42"
              fill="#FFBC42"
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
