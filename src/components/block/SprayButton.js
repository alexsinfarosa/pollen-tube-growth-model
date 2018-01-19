import React from "react";
import { inject, observer } from "mobx-react";

import { Row, Col, Button } from "antd";

const SprayButton = inject("app")(
  observer(function SprayButton({ app: { bpts, bStore }, bl, breakpoints }) {
    let sprayButtonLabel;
    const count = bl.dates.filter(date => date).length;
    if (count === 1) sprayButtonLabel = "Set 1st Spray";
    if (count === 2) sprayButtonLabel = "Set 2nd Spray";
    if (count === 3) sprayButtonLabel = "Set 3rd Spray";

    return (
      <Row>
        <Col xs={8} sm={24} md={24} lg={24} style={{ textAlign: "center" }}>
          <Button
            size={breakpoints.xs ? "small" : "default"}
            style={{ marginTop: 16 }}
            onClick={() => bStore.selectBlock("isSprayModal", bl.id)}
          >
            {sprayButtonLabel}
          </Button>
        </Col>
      </Row>
    );
  })
);

export default SprayButton;
