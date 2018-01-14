import React from "react";
import { inject, observer } from "mobx-react";
import { Table } from "antd";

//columns for the growth table
const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: "20%"
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
        dataIndex: "cumulativeHrGrowth",
        key: "cumulativeHrGrowth",
        width: "20%",
        render: d => Number(d).toFixed(3)
      }
    ]
  },
  {
    title: "% of Target",
    dataIndex: "percentage",
    key: "percentage",
    width: "20%",
    render: perc => Number(perc).toFixed(3)
  }
];

const GrowthTable = inject("app")(
  observer(function GrowthTable({ app: { bStore }, bl }) {
    return (
      <Table
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
