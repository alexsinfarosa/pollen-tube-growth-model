import React from "react";
import { inject, observer } from "mobx-react";
import format from "date-fns/format";

// antd
import { Col, Steps } from "antd";
const Step = Steps.Step;

const BlockSteps = inject("app")(
  observer(function BlockSteps({ app, breakpoints, bl }) {
    const StepTitle = props => <small>{props.children}</small>;

    const StepDate = bl.stepDate.map(obj => {
      return (
        <Step
          key={obj.date}
          status={obj.status}
          title={<StepTitle date={obj}>{obj.name}</StepTitle>}
          description={<small>{format(obj.date, "YY/MM/DD HH:00")}</small>}
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
