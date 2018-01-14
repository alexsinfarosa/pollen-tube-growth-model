import React from "react";
import { inject, observer } from "mobx-react";

// components
import BlockTop from "components/block/BlockTop";
import DateStyleLengthBar from "components/block/DateStyleLengthBar";
import BlockSteps from "components/block/BlockSteps";

import BlockFooter from "components/block/BlockFooter";
import { Row, Col } from "antd";

const BlockBody = inject("app")(
  observer(function BlockBody({ app: { bpts }, bl }) {
    return (
      <Row>
        {bl.modelData ? (
          <Col>
            <BlockTop breakpoints={bpts} bl={bl} />
            <BlockSteps breakpoints={bpts} bl={bl} />
            ciccio
            <BlockFooter breakpoints={bpts} bl={bl} />
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
