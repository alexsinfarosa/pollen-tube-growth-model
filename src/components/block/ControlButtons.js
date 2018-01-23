import React from "react";
import { inject, observer } from "mobx-react";

import { ControlBarWrapper } from "styles";
import { Col, Button } from "antd";

const ControlButtons = inject("app")(
  observer(function ControlButtons({ app: { bStore }, bl, breakpoints }) {
    const bpts = breakpoints;

    let sprayButtonLabel;
    const count = bl.dates.filter(date => date).length;
    if (count === 1) sprayButtonLabel = "Set 1st Spray";
    if (count === 2) sprayButtonLabel = "Set 2nd Spray";
    if (count === 3) sprayButtonLabel = "Set 3rd Spray";

    return (
      <ControlBarWrapper>
        {bl.dates.length < 4 && (
          <Col span={6} style={{ textAlign: "center" }}>
            <Button
              icon={"calendar"}
              type="primary"
              shape={bpts.md ? null : "circle"}
              size={bpts.xs ? "small" : "default"}
              ghost={true}
              onClick={() => bStore.selectBlock("isDateModal", bl.id)}
            >
              {bpts.md ? sprayButtonLabel : null}
            </Button>
          </Col>
        )}
        <Col span={6} style={{ textAlign: "center" }}>
          <Button
            icon={"table"}
            type="primary"
            shape={bpts.md ? null : "circle"}
            size={bpts.xs ? "small" : "default"}
            ghost={bStore.isTable ? false : true}
            onClick={bStore.toggleTable}
          >
            {bpts.md ? "Growth Table" : null}
          </Button>
        </Col>
        <Col span={6} style={{ textAlign: "center" }}>
          <Button
            icon={"dot-chart"}
            type="primary"
            shape={bpts.md ? null : "circle"}
            size={bpts.xs ? "small" : "default"}
            ghost={bStore.isGraph ? false : true}
            onClick={bStore.toggleGraph}
          >
            {bpts.md ? "Growth Graph" : null}
          </Button>
        </Col>
        <Col span={6} style={{ textAlign: "center" }}>
          <Button
            icon={"environment-o"}
            type="primary"
            shape={bpts.md ? null : "circle"}
            size={bpts.xs ? "small" : "default"}
            ghost={bStore.isMap ? false : true}
            onClick={bStore.toggleMap}
          >
            {bpts.md ? "Stations Map" : null}
          </Button>
        </Col>
      </ControlBarWrapper>
    );
  })
);

export default ControlButtons;
