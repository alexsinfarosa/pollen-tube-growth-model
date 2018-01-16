import React from "react";
import { inject, observer } from "mobx-react";

// components
import BlockTop from "components/block/BlockTop";
import DateStyleLengthBar from "components/block/DateStyleLengthBar";
import BlockSteps from "components/block/BlockSteps";
import USMap from "components/USMap";

import BlockFooter from "components/block/BlockFooter";
import { Row, Col, Button } from "antd";

const BlockBody = inject("app")(
  observer(function BlockBody({ app: { bpts, bStore }, bl }) {
    let sprayButtonLabel;
    let count = 2;
    if (bl.stepDate) count = bl.stepDate.length;
    if (count === 2) sprayButtonLabel = "Set 1st Spray";
    if (count === 3) sprayButtonLabel = "Set 2nd Spray";
    if (count === 4) sprayButtonLabel = "Set 3rd Spray";

    return (
      <Row>
        {bl.modelData ? (
          <Col>
            <BlockTop breakpoints={bpts} bl={bl} />
            <BlockSteps breakpoints={bpts} bl={bl} />
            {count < 5 && (
              <div
                style={{
                  textAlign: "center"
                }}
              >
                <Button
                  style={{ marginTop: 16 }}
                  onClick={() => bStore.addSprayDate(bl.id)}
                >
                  {sprayButtonLabel}
                </Button>
              </div>
            )}
            <div style={{ color: "white" }}>x</div>
            {bStore.isMap ? (
              <USMap bl={bl} />
            ) : (
              <BlockFooter breakpoints={bpts} bl={bl} />
            )}
          </Col>
        ) : (
          <Col>
            <DateStyleLengthBar breakpoints={bpts} bl={bl} />
          </Col>
        )}
      </Row>
    );
  })
);

export default BlockBody;
