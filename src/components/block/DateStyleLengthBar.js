import React from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
// antd
import { Row, Col, Button } from "antd";

// styled components
import { RowCentered } from "styles";

import moment from "moment";

const DateStyleLengthBar = inject("app")(
  observer(function DateStyleLengthBar({
    app: { bStore },
    bl,
    breakpoints: bpts
  }) {
    return (
      <Row type="flex" justify="space-between" align="center">
        {bl.startDate ? (
          <RowCentered style={{ height: 32 }}>
            <Col style={{ fontSize: bpts.xs ? "0.8rem" : "0.8rem" }}>
              Model Start Date: {moment(bl.startDate).format("YY/MM/DD HH:00")}
            </Col>
          </RowCentered>
        ) : (
          <RowCentered style={{ height: 32 }}>
            <Col>
              <Button
                type="default"
                size={bpts.xs ? "small" : "default"}
                style={{ width: "100%" }}
                onClick={() => bStore.selectBlock("isDateModal", bl.id)}
              >
                Start Date
              </Button>
            </Col>
          </RowCentered>
        )}

        {bl.avgStyleLength ? (
          <RowCentered style={{ height: 32 }}>
            <Col style={{ fontSize: bpts.xs ? "0.8rem" : "0.8rem" }}>
              Average Style Length: {bl.avgStyleLength.toPrecision(4)} (mm)
            </Col>
          </RowCentered>
        ) : (
          <RowCentered style={{ height: 32 }}>
            <Col>
              <Button
                type="default"
                size={bpts.xs ? "small" : "default"}
                style={{ width: "100%" }}
                onClick={() => bStore.selectBlock("isStyleLengthModal", bl.id)}
              >
                Style Length
              </Button>
            </Col>
          </RowCentered>
        )}
      </Row>
    );
  })
);

export default DateStyleLengthBar;
