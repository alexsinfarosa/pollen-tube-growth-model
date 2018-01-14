import React from "react";
import { inject, observer } from "mobx-react";

// components
import DateStyleLengthBar from "components/block/DateStyleLengthBar";

import { Row, Col } from "antd";

const BlockBody = inject("app")(
  observer(function BlockBody({ app, bl }) {
    return (
      <Row>
        <Col>
          <DateStyleLengthBar bl={bl} />
        </Col>
      </Row>
    );
  })
);

export default BlockBody;
