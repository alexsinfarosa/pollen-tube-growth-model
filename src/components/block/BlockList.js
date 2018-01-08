import React from "react";
import { inject, observer } from "mobx-react";

import Block from "components/block/Block";

const BlockList = inject("app")(
  observer(function BlockList({ app: { bpts, blocks } }) {
    const blockList = blocks.values().map(el => {
      return <Block key={el.id} bl={el} breakpoints={bpts} />;
    });
    return <div>{blockList}</div>;
  })
);

export default BlockList;
