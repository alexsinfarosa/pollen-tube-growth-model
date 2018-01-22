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
    dataIndex: "Temperature",
    key: "Temperature",
    width: "20%"
  },
  {
    title: "Growth (mm)",
    width: "40%",
    children: [
      {
        title: "Hourly",
        dataIndex: "HourlyGrowth",
        key: "HourlyGrowth",
        width: "20%",
        render: d => Number(d).toFixed(2)
      },
      {
        title: "Accumulated",
        dataIndex: "Cumulative Hourly Growth",
        key: "Cumulative Hourly Growth",
        width: "20%",
        render: d => Number(d).toFixed(2)
      }
    ]
  },
  {
    title: "% of Target",
    dataIndex: "Emergence",
    key: "Emergence",
    width: "20%",
    render: perc => Number(perc).toFixed(0)
  }
];

const GrowthTable = inject("app")(
  observer(function GrowthTable({ app: { bStore }, bl }) {
    const dates = bl.dates.map(d => getTime(d));
    const sprayDateRow = date => {
      if (dates.includes(getTime(date))) {
        return "hilight";
      }
    };

    return (
      <Table
        style={{ marginTop: 16 }}
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
