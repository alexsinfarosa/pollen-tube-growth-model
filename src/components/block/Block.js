import React from "react";
import { inject, observer } from "mobx-react";

// styled components
import { BlockWrapper } from "styles";

// components
import BlockHeader from "./BlockHeader";
import BlockBody from "components/block/BlockBody";
// import USMap from "components/USMap";

import { Spin } from "antd";

const Block = inject("app")(
  observer(function Block({ app: { bpts, bStore }, bl }) {
    return (
      <BlockWrapper>
        {bStore.isLoading ? (
          <Spin />
        ) : (
          <div>
            <BlockHeader bl={bl} breakpoints={bpts} />
            <BlockBody bl={bl} breakpoints={bpts} />
          </div>
        )}
      </BlockWrapper>
    );
  })
);

export default Block;
