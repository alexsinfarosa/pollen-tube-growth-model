import React from "react";
import { inject, observer } from "mobx-react";

// styled components
import { BlockWrapper } from "styles";

// components
import BlockHeader from "./BlockHeader";
import DateStyleLengthBar from "components/block/DateStyleLengthBar";

const Block = inject("app")(
  observer(function Block({ app: { bpts }, bl }) {
    return (
      <BlockWrapper>
        <BlockHeader bl={bl} breakpoints={bpts} />
        <DateStyleLengthBar bl={bl} />
      </BlockWrapper>
    );
  })
);

export default Block;
