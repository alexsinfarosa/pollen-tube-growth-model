import React from "react";
import { inject, observer } from "mobx-react";

// styled components
import { BlockWrapper } from "styles";

// components
import BlockHeader from "./BlockHeader";
import EmergenceGraph from "./EmergenceGraph";
import SprayButton from "./SprayButton";
import SprayDateModal from "modals/SprayDateModal";
import DateStyleLengthBar from "./DateStyleLengthBar";
import USMap from "./USMap";
import BlockTabs from "./BlockTabs";

import { Spin } from "antd";

const Block = inject("app")(
  observer(function Block({ app: { bpts, bStore }, bl, breakpoints }) {
    return (
      <BlockWrapper>
        {bStore.isLoading ? (
          <Spin />
        ) : (
          <div>
            <BlockHeader bl={bl} breakpoints={bpts} />
            {bl.startDate && bl.avgStyleLength ? (
              <div>
                <EmergenceGraph bl={bl} breakpoints={bpts} />
                {bl.dates.length < 4 && (
                  <SprayButton bl={bl} breakpoints={bpts} />
                )}
                {bStore.isMap && <USMap bl={bl} breakpoints={bpts} />}
                {!breakpoints.xs && <BlockTabs bl={bl} breakpoints={bpts} />}
                <SprayDateModal bl={bl} breakpoints={bpts} />
              </div>
            ) : (
              <DateStyleLengthBar bl={bl} breakpoints={bpts} />
            )}
          </div>
        )}
      </BlockWrapper>
    );
  })
);

export default Block;
