import React from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";

// antd
import { Row, Col, Button } from "antd";

// styled components
import { RowCentered } from "styles";

// utils
import { formatDate } from "utils/utils";

const DateStyleLengthBar = inject("app")(
  observer(function DateStyleLengthBar({ app: { bStore }, bl }) {
    return (
      <Row type="flex" justify="space-between" align="center">
        {bl.dates.length !== 0 ? (
          <RowCentered style={{ height: 32 }}>
            <Col>Model Start Date: {formatDate(bl.startDate)}</Col>
          </RowCentered>
        ) : (
          <Button
            type="default"
            style={{ maxWidth: "40%" }}
            onClick={() => bStore.selectBlock("isDateModal", bl.id)}
          >
            Set Start Date
          </Button>
        )}

        {bl.avgStyleLength ? (
          <RowCentered style={{ height: 32 }}>
            <Col>
              Average Style Length: {bl.avgStyleLength.toPrecision(4)} (mm)
            </Col>
          </RowCentered>
        ) : (
          <Button
            type="default"
            style={{ maxWidth: "40%" }}
            onClick={() => bStore.selectBlock("isStyleLengthModal", bl.id)}
          >
            Set Style Length
          </Button>
        )}
      </Row>
    );
  })
);

export default DateStyleLengthBar;
