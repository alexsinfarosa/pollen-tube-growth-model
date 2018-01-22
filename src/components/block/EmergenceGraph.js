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

// const ForecastLabel = props => {
//   console.log(props);
//   const { x, y } = props.viewBox;
//   return (
//     <div>
//       <small>FORECAST</small>
//       <text x={x} y={y} dy={10} fontSize={12} textAnchor="middle">
//         <small>{format(props.date, "MM-DD HH:00")}</small>
//       </text>
//     </div>
//   );
// };

const EmergenceGraph = inject("app")(
  observer(function EmergenceGraph({ app, bl }) {
    // const lineReference = arr =>
    //   arr.slice(1).map((date, c) => {
    //     const x = format(date, "MMM DD HH:00");
    //     const isToday = isEqual(new Date(date), new Date(bl.now));
    //     const isLastDay = isEqual(new Date(date), new Date(bl.dateAtThreshold));
    //     if (isLastDay) {
    //       return (
    //         <ReferenceLine
    //           key={c}
    //           x={x}
    //           stroke="#eeeeee"
    //           label={`${format(bl.dateAtThreshold, "MM-DD HH:00")}`}
    //         />
    //       );
    //     } else {
    //       return (
    //         <ReferenceLine
    //           key={c}
    //           x={x}
    //           stroke="#eeeeee"
    //           label={isToday ? "Now" : `${c + 1}˚Spray`}
    //         />
    //       );
    //     }
    //   });

    const CustomizedLabel = props => {
      const { x, y, stroke, value, index } = props;
      const isEmergence = bl.datesIdxForGraph
        .slice(1)
        .some(idx => idx === index);
      const isToday = isEqual(
        new Date(bl.modelData[bl.todayIdx].date),
        new Date(bl.modelData[index].date)
      );
      // console.log(bl.modelData[bl.todayIdx].date, bl.modelData[index].date);
      if (isEmergence && x !== null && y !== null) {
        return (
          <g>
            <text
              x={x}
              y={y}
              dy={-4}
              fill={stroke}
              fontSize={13}
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

    return (
      <GraphWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            syncId="ciccio"
            data={bl.modelDataUpTo100}
            margin={{ top: 20, right: 20, left: -20, bottom: 20 }}
            style={{ background: "#fafafa", borderRadius: "5px" }}
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
            <Brush
              style={{ borderRadius: 10 }}
              stroke="#63A07F"
              tickFormatter={x => bl.modelData[x].date}
              height={20}
              // onChange={e => console.log(e.startIndex, e.endIndex)}
              // startIndex={0}
              // endIndex={bl.lastIdx === -1 ? null : bl.lastIdx}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default EmergenceGraph;
