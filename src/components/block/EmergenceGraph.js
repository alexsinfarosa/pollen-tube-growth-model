import React from "react";
import { inject, observer } from "mobx-react";
// import format from "date-fns/format";
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
  Area
} from "recharts";
import { GraphWrapper } from "../../styles";

const CustomTooltip = props => {
  const { payload } = props;
  if (payload) {
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
  }
  return null;
};

const EmergenceGraph = inject("app")(
  observer(function EmergenceGraph({ app, bl, breakpoints }) {
    const CustomizedLabel = props => {
      const { x, y, stroke, value, index } = props;
      const isEmergence = bl.datesIdxForGraph
        .slice(1)
        .some(idx => idx === index);
      const isToday = isEqual(
        new Date(bl.modelData[bl.todayIdx].date),
        new Date(bl.modelData[index].date)
      );
      if (isEmergence && x !== null && y !== null) {
        return (
          <g>
            <text
              x={x}
              y={y}
              dy={-4}
              fill={stroke}
              fontSize={breakpoints.xs ? 9 : 13}
              textAnchor="middle"
            >
              {value}%
            </text>
            <circle
              className={isToday ? "pulse" : null}
              cx={x}
              cy={y}
              r={isToday ? "5" : "3"}
              stroke={stroke}
            />
          </g>
        );
      }
      return null;
    };

    const CustomXLabel = props => {
      const { x, y, payload } = props;
      return (
        <g transform={`translate(${x},${y})`}>
          <text
            x={0}
            y={0}
            dy={12}
            fontSize={breakpoints.xs ? 8 : 11}
            textAnchor="middle"
            fill="#666"
            transform="rotate(-10)"
          >
            {payload.value}
          </text>
        </g>
      );
    };

    const CustomYLabel = props => {
      const { x, y, payload } = props;
      return (
        <g>
          <text
            x={x}
            y={y}
            // dy={0}
            dx={-15}
            fontSize={breakpoints.xs ? 8 : 12}
            textAnchor="middle"
            fill="#666"
          >
            {payload.value}
          </text>
        </g>
      );
    };

    return (
      <GraphWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            syncId="ciccio"
            data={bl.modelDataUpTo100}
            margin={{
              top: breakpoints.xs ? 10 : 15,
              right: breakpoints.xs ? 10 : 20,
              left: breakpoints.xs ? -40 : -15,
              bottom: breakpoints.xs ? 10 : 15
            }}
            style={{ background: "#fafafa", borderRadius: "5px" }}
          >
            <XAxis
              dataKey="Date"
              // domain={["dataMin", "dataMax"]}
              // minTickGap={40}
              // tickSize={10}
              interval="preserveStart"
              axisLine={false}
              tick={<CustomXLabel />}
            />
            <YAxis
              unit={"%"}
              hide={false}
              axisLine={false}
              tick={<CustomYLabel />}
            />
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
              label={<CustomizedLabel />}
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
              label={<CustomizedLabel />}
            />
            {!breakpoints.xs && (
              <Brush
                style={{ borderRadius: 10, marginTop: 5, paddingTop: 5 }}
                stroke="#63A07F"
                tickFormatter={x => bl.modelData[x].date}
                height={breakpoints.xs ? 15 : 20}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default EmergenceGraph;
