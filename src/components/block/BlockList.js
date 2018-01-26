import React from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
import Block from "components/block/Block";

const BlockList = inject("app")(
  observer(function BlockList({ app: { bpts, filteredBlocks } }) {
    const blockList = filteredBlocks.map(block => {
      console.log(block);
      return <Block key={block.id} bl={block} breakpoints={bpts} />;
    });

    return <div>{blockList}</div>;
  })
);

export default BlockList;
