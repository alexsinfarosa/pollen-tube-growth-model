import React from "react";
import { inject, observer } from "mobx-react";

// styled components
import { BlockWrapper } from "styles";

// components
import BlockHeader from "./BlockHeader";
import EmergenceGraph from "./EmergenceGraph";
import SprayButton from "./SprayButton";
import DateStyleLengthBar from "./DateStyleLengthBar";
import USMap from "./USMap";
import BlockTabs from "./BlockTabs";

// Modals
import EditBlockModal from "modals/EditBlockModal";
import SprayDateModal from "modals/SprayDateModal";

import { Spin } from "antd";

const Block = inject("app")(
  observer(function Block({ app: { bpts, bStore }, bl, breakpoints }) {
    return (
      <BlockWrapper>
        {bStore.isLoading ? (
          <Spin />
        ) : (
          <div>
            <SprayDateModal bl={bl} breakpoints={bpts} />
            <EditBlockModal bl={bl} breakpoints={bpts} />

            <BlockHeader bl={bl} breakpoints={bpts} />
            {bl.startDate && bl.avgStyleLength ? (
              <div>
                {bl.modelData && <EmergenceGraph bl={bl} breakpoints={bpts} />}
                {bl.dates.length < 4 && (
                  <SprayButton bl={bl} breakpoints={bpts} />
                )}
                {bStore.isMap && <USMap bl={bl} breakpoints={bpts} />}
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
