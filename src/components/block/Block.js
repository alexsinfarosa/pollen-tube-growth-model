import React from "react";
import { inject, observer } from "mobx-react";

// styled components
import { BlockWrapper } from "styles";

// components
import BlockHeader from "./BlockHeader";
import BlockBody from "components/block/BlockBody";

import { Row, Spin } from "antd";

const Block = inject("app")(
  observer(function Block({ app: { bpts, isDataLoaded }, bl }) {
    return (
      <BlockWrapper>
        <BlockHeader bl={bl} breakpoints={bpts} />
        {isDataLoaded ? (
          <Row type="flex" justify="center" align="middle">
            <Spin />
          </Row>
        ) : (
          <BlockBody bl={bl} breakpoints={bpts} />
        )}
      </BlockWrapper>
    );
  })
);

export default Block;
