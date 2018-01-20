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
            Cumulative HG: {obj.payload["Cumulative Hourly Growth"].toFixed(1)}mm
          </div>
        </div>
      )}
    </div>
  );
};

const CumulativeGrowthGraph = inject("app")(
  observer(function CumulativeGrowthGraph({ app: { bStore }, bl }) {
    return (
      <GraphWrapper>
        <h4>Cumulative Hourly Pollen Tube Growth (mm)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            syncId="ciccio"
            data={bl.modelData}
            margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
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
            />
          </ComposedChart>
        </ResponsiveContainer>
      </GraphWrapper>
    );
  })
);

export default CumulativeGrowthGraph;
