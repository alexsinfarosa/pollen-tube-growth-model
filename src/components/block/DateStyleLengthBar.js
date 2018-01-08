import React from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
// antd
import { Row, Col, Button } from "antd";

// styled components
import { RowCentered } from "styles";

const DateStyleLengthBar = inject("app")(
  observer(function DateStyleLengthBar({
    app: { formatDate, blockStore },
    bl
  }) {
    return (
      <Row type="flex" justify="space-between" align="center">
        {bl.dates.length !== 0 ? (
          <RowCentered>
            <Col>Model Start Date: {formatDate(bl.dates[0])}</Col>
          </RowCentered>
        ) : (
          <Button
            type="default"
            style={{ maxWidth: "40%" }}
            onClick={() => blockStore.showDateModal(bl.id)}
          >
            Set Start Date
          </Button>
        )}

        {bl.avgStyleLength ? (
          <RowCentered>
            <Col>
              Average Style Length: {bl.avgStyleLength.toPrecision(4)} (mm)
            </Col>
          </RowCentered>
        ) : (
          <Button
            type="default"
            style={{ maxWidth: "40%" }}
            // onClick={}
          >
            Set Style Length
          </Button>
        )}
      </Row>
    );
  })
);

export default DateStyleLengthBar;
