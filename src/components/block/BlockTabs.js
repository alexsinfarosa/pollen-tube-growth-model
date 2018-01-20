import React from "react";
import { inject, observer } from "mobx-react";

import GrowthTable from "./GrowthTable";
import CumulativeGrowthGraph from "./CumulativeGrowthGraph";
import HourlyTempGraph from "./HourlyTempGraph";

// antd
import { Tabs, Icon } from "antd";
const TabPane = Tabs.TabPane;

const BlockTabs = inject("app")(
  observer(function BlockTabs({ app, bl }) {
    return (
      <Tabs
        defaultActiveKey="0"
        tabBarStyle={{ textAlign: "center" }}
        type="line"
        //   onChange={() => setGridData(block.id)}
      >
        <TabPane
          tab={
            <span>
              <Icon type="table" />Growth Table
            </span>
          }
          key="1"
        >
          <GrowthTable bl={bl} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="dot-chart" />Growth Graph
            </span>
          }
          key="2"
        >
          <HourlyTempGraph bl={bl} />
          <div style={{ margin: "32px 0" }}>
            <CumulativeGrowthGraph bl={bl} />
          </div>
        </TabPane>
      </Tabs>
    );
  })
);

export default BlockTabs;
