import React from "react";
import { inject, observer } from "mobx-react";

import { BFooter } from "styles";
import GrowthTable from "components/GrowthTable";
import GrowthGraph from "components/GrowthGraph";

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
            <GrowthGraph bl={bl} />
          </TabPane>
        </Tabs>
      </BFooter>
    );
  })
);

export default BlockFooter;
