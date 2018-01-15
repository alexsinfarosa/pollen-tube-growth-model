import React from "react";
import { inject, observer } from "mobx-react";

// utils
import { formatDate } from "utils/utils";
// antd
import { Col, Steps } from "antd";
const Step = Steps.Step;

const BlockSteps = inject("app")(
  observer(function BlockSteps({ app, breakpoints, bl }) {
    const StepTitle = props => <small>{props.children}</small>;

    const StepDate = bl.stepDate.map(obj => {
      // console.log(obj);
      return (
        <Step
          key={obj.date}
          status={obj.status}
          title={<StepTitle date={obj}>{obj.name}</StepTitle>}
          description={<small>{formatDate(obj.date)}</small>}
        />
      );
    });

    return (
      <Col xs={8} sm={24} md={24} lg={24}>
        <Steps
          size={"small"}
          current={4}
          direction={breakpoints.xs ? "vertical" : "horizontal"}
          progressDot
        >
          {StepDate}
        </Steps>
      </Col>
    );
  })
);

export default BlockSteps;
