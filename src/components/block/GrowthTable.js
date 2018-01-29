import React from "react";
import { inject, observer } from "mobx-react";
import { Table } from "antd";
import format from "date-fns/format";

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
    dataIndex: "temperature",
    key: "temperature",
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
        render: d => Number(d).toFixed(2)
      },
      {
        title: "Accumulated",
        dataIndex: "cHrGrowth",
        key: "cHrGrowth",
        width: "20%",
        render: d => Number(d).toFixed(2)
      }
    ]
  },
  {
    title: "% of Target",
    dataIndex: "emergence",
    key: "emergence",
    width: "20%",
    render: perc => Number(perc).toFixed(0)
  }
];

const GrowthTable = inject("app")(
  observer(function GrowthTable({ app: { bStore }, bl }) {
    const sprayDateRow = rec => {
      if (rec.isSelected) {
        return "table hilight";
      }
      return "table";
    };
    return (
      <Table
        style={{ margin: "16px auto" }}
        rowClassName={rec => sprayDateRow(rec)}
        size="middle"
        dataSource={bl.modelData}
        columns={columns}
        pagination={false}
        rowKey={bl => bl.date}
        loading={bStore.modelData}
        scroll={{ y: "35vh" }}
        bordered={true}
      />
    );
  })
);

export default GrowthTable;
