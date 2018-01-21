import React from "react";
import { inject, observer } from "mobx-react";
import isAfter from "date-fns/is_after";
import isBefore from "date-fns/is_before";
import addHours from "date-fns/add_hours";
import subHours from "date-fns/sub_hours";

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

const CustomTooltip = props => {
  const { payload } = props;
  const obj = payload[0];
  if (obj) {
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
              Cumulative HPTG:{" "}
              {obj.payload["Cumulative Hourly Growth"].toFixed(1)}mm
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const CumulativeGrowthGraph = inject("app")(
  observer(function CumulativeGrowthGraph({ app: { bStore }, bl }) {
    const CustomizedLabel = props => {
      const { x, y, stroke, value, index } = props;
      const isEmergence = bl.datesIdxForGraph
        .slice(1)
        .some(idx => idx === index);
      const isToday = bl.todayIdx === index;
      if (isEmergence && x !== null && y !== null) {
        return (
          <g>
            <text
              x={x}
              y={y}
              dy={-6}
              fill={stroke}
              fontSize={13}
              textAnchor="middle"
            >
              {value.toFixed(1)}mm
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
    return (
      <GraphWrapper>
        <h4>Cumulative Hourly Pollen Tube Growth (mm)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            syncId="ciccio"
            data={bl.modelDataUpTo100}
            margin={{ top: 20, right: 30, left: -20, bottom: 20 }}
            style={{ background: "#fafafa", borderRadius: "5px" }}
          >
            <XAxis
              dataKey="Date"
              minTickGap={40}
              tickSize={10}
              interval="preserveStartEnd"
              axisLine={false}
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
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
              label={<CustomizedLabel />}
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
              label={<CustomizedLabel />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default CumulativeGrowthGraph;
