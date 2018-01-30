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
import HourlyTempGraph from "./HourlyTempGraph";
import Message from "./Message";
import BlockSteps from "./BlockSteps";

// Modals
import EditBlockModal from "modals/EditBlockModal";
import SprayDateModal from "modals/SprayDateModal";
import StartDateModal from "modals/StartDateModal";
import StyleLengthModal from "modals/StyleLengthModal";
import { Spin, Progress } from "antd";

const Block = inject("app")(
  observer(function Block({
    app: { filteredBlocks, bStore },
    bl,
    breakpoints: bpts
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
            <StyleLengthModal bl={bl} breakpoints={bpts} />

            <BlockHeader bl={bl} breakpoints={bpts} />

            {bl.startDate && bl.avgStyleLength ? (
              <div>
                {bl.isMessage && <Message bl={bl} breakpoints={bpts} />}
                {filteredBlocks.length === 1 ? (
                  <div>
                    {bl.modelData && (
                      <EmergenceGraph bl={bl} breakpoints={bpts} />
                    )}
                    <ControlButtons bl={bl} breakpoints={bpts} />
                    {bStore.isMap && <USMap bl={bl} breakpoints={bpts} />}
                    {bStore.isTable && <GrowthTable bl={bl} />}
                    {bStore.isGraph && (
                      <HourlyTempGraph bl={bl} breakpoints={bpts} />
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <BlockSteps bl={bl} breakpoints={bpts} />
                    {bpts.xs && (
                      <div
                        style={{
                          textAlign: "center",
                          width: "100%"
                        }}
                      >
                        <Progress
                          type="circle"
                          percent={bl.todayEmergence}
                          width={60}
                          format={e => (e >= 100 ? "Spray!" : `${e}%`)}
                        />
                      </div>
                    )}
                  </div>
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
