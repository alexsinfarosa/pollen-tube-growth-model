import React from "react";
import { inject, observer } from "mobx-react";

// styled components
import { BlockWrapper } from "styles";

// components
import BlockHeader from "./BlockHeader";
import EmergenceGraph from "./EmergenceGraph";
import ControlButtons from "./ControlButtons";
import DateStyleLengthBar from "./DateStyleLengthBar";
import USMap from "./USMap";
import GrowthTable from "./GrowthTable";
import CumulativeGrowthGraph from "./CumulativeGrowthGraph";
import HourlyTempGraph from "./HourlyTempGraph";
import Message from "./Message";

// Modals
import EditBlockModal from "modals/EditBlockModal";
import SprayDateModal from "modals/SprayDateModal";
import StartDateModal from "modals/StartDateModal";
import StyleLengthModal from "modals/StyleLengthModal";

import { Spin } from "antd";

const Block = inject("app")(
  observer(function Block({
    app: { filteredBlocks, bpts, bStore },
    bl,
    breakpoints
  }) {
    return (
      <BlockWrapper>
        {bStore.isLoading ? (
          <Spin />
        ) : (
          <div>
            <SprayDateModal bl={bl} breakpoints={bpts} />
            <EditBlockModal bl={bl} breakpoints={bpts} />
            <StartDateModal bl={bl} breakpoints={bpts} />
            <StyleLengthModal breakpoints={bpts} />

            <BlockHeader bl={bl} breakpoints={bpts} />

            {bl.startDate && bl.avgStyleLength ? (
              <div>
                {bl.isMessage && <Message bl={bl} breakpoints={bpts} />}
                {bl.modelData && <EmergenceGraph bl={bl} breakpoints={bpts} />}

                {filteredBlocks.length === 1 && (
                  <ControlButtons bl={bl} breakpoints={bpts} />
                )}

                {bStore.isMap && <USMap bl={bl} breakpoints={bpts} />}
                {bStore.isTable && <GrowthTable bl={bl} />}
                {bStore.isGraph && (
                  <HourlyTempGraph bl={bl} breakpoints={bpts} />
                )}
                {bStore.isGraph && (
                  <CumulativeGrowthGraph bl={bl} breakpoints={bpts} />
                )}
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
