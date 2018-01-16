import React from "react";
import { inject, observer } from "mobx-react";
import { Table } from "antd";
// import isBefore from "date-fns/is_before";
import format from "date-fns/format";
import { getTime } from "date-fns";

//columns for the growth table
const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: "20%",
    defaultSortOrder: "descend",
    sorter: (a, b) => new Date(a.date) - new Date(b.date),
    render: d => format(d, "YYYY-MM-DD HH:00")
  },
  {
    title: "Air Temp (˚F)",
    dataIndex: "temp",
    key: "temp",
    width: "20%"
  },
  {
    title: "Growth (mm)",
    width: "40%",
    children: [
      {
        title: "Hourly",
        dataIndex: "hourlyGrowth",
        key: "hourlyGrowth",
        width: "20%",
        render: d => Number(d).toFixed(3)
      },
      {
        title: "Accumulated",
        dataIndex: "cumulativeHrGrowthSpray",
        key: "cumulativeHrGrowthSpray",
        width: "20%",
        render: d => Number(d).toFixed(3)
      }
    ]
  },
  {
    title: "% of Target",
    dataIndex: "percentageSpray",
    key: "percentageSpray",
    width: "20%",
    render: perc => Number(perc).toFixed(3)
  }
];

const GrowthTable = inject("app")(
  observer(function GrowthTable({ app: { bStore }, bl }) {
    const dates = bl.stepDate.map(d => getTime(d.date));
    const sprayDateRow = date => {
      if (dates.includes(getTime(date))) {
        return "hilight";
      }
    };

    return (
      <Table
        rowClassName={(rec, idx) => sprayDateRow(rec.date)}
        size="middle"
        dataSource={bl.modelData}
        columns={columns}
        pagination={false}
        rowKey={bl => bl.date}
        loading={bStore.isLoading}
        scroll={{ y: "35vh" }}
        bordered={true}
      />
    );
  })
);

export default GrowthTable;
