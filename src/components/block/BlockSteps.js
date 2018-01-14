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

    const StepIcon = props => {
      return (
        <svg className="button" expanded="true" height="24px" width="24px">
          <circle cx="50%" cy="50%" r="7px" fill="#4EA27D" />
          <circle
            className={props.name === "Today" && "pulse"}
            cx="50%"
            cy="50%"
            r="8px"
            fill="#E8E8E8"
          />
        </svg>
      );
    };

    const StepDate = bl.stepDate.map(date => (
      <Step
        key={date.date}
        status={date.status}
        icon={<StepIcon name={date.name} />}
        title={<StepTitle date={date}>{date.name}</StepTitle>}
        description={
          bl.stepDate ? <small>{formatDate(date.date)}</small> : null
        }
      />
    ));

    return (
      <Col xs={8} sm={24} md={24} lg={24}>
        <Steps
          size="small"
          direction={false ? "vertical" : "horizontal"}
          // progressDot={true}
          // current={block.date ? block.currentIndex : null}
          // status={dateRange[block.currentIndex]}
        >
          {StepDate}
        </Steps>
      </Col>
    );
  })
);

export default BlockSteps;
