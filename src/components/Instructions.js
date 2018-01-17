import React from "react";
import { inject, observer } from "mobx-react";

import { Row, Col, Steps } from "antd";
const Step = Steps.Step;

const Instructions = inject("app")(
  observer(function Instructions({ app }) {
    return (
      <Row type="flex" justify="center">
        <Col>
          <Steps direction="vertical" progressDot>
            <Step
              title="Create Block"
              description="Click on the '+ Block' button in the upper left to create a new block."
            />
            <Step
              title="Insert style length or start date"
              description="The order is arbitrary"
            />
            <Step
              title="Set start date"
              description="You need to provide a date and time."
            />
            <Step
              title="Set style length"
              description="There are two options: The fist option is to insert the average style length. The second option is to insert the style length measurements, the software in this case will calculate the average."
            />
          </Steps>
        </Col>
      </Row>
    );
  })
);

export default Instructions;
