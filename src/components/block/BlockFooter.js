import React from "react";
import { inject, observer } from "mobx-react";

import { BFooter } from "styles";
import GrowthTable from "components/GrowthTable";

// antd
import { Tabs, Icon } from "antd";
const TabPane = Tabs.TabPane;

const BlockFooter = inject("app")(
  observer(function BlockFooter({ app, bl }) {
    return (
      <BFooter>
        <Tabs
          defaultActiveKey="0"
          tabBarStyle={{ textAlign: "center" }}
          type="card"
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
            Growth Graph
          </TabPane>
        </Tabs>
      </BFooter>
    );
  })
);

export default BlockFooter;
