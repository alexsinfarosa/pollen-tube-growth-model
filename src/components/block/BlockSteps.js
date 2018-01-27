import React from "react";
import { inject, observer } from "mobx-react";

import { Steps, Popover, Icon } from "antd";
import format from "date-fns/format";
import isEqual from "date-fns/is_equal";

const BlockSteps = inject("app")(
  observer(function BlockSteps({ app, bStore, bl, breakpoints: bpts }) {
    const Title = ({ obj }) => {
      const isToday = isEqual(new Date(obj.date), new Date(bl.now));
      return (
        <small style={{ color: isToday ? "black" : null }}>{obj.name}</small>
      );
    };

    const Description = ({ obj }) => {
      const isToday = isEqual(new Date(obj.date), new Date(bl.now));
      return (
        <small style={{ color: isToday ? "black" : null }}>
          {format(obj.date, "YY/MM/DD HH:00")}
        </small>
      );
    };

    const Emergence = ({ obj, bpts, bl }) => {
      const isToday = isEqual(new Date(obj.date), new Date(bl.now));
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: bpts.xs ? "0.7rem" : "0.9rem",
            color: isToday ? "black" : null
          }}
        >
          {obj.emergence}%
        </div>
      );
    };

    const BlockStep = bl.stepDates.map(obj => {
      return (
        <Steps.Step
          key={obj.date}
          status={"wait"}
          title={<Title obj={obj} />}
          description={<Description obj={obj} />}
          icon={<Emergence bpts={bpts} bl={bl} obj={obj} />}
        />
      );
    });
    return (
      <Steps
        direction={bpts.xs ? "vertical" : "horizontal"}
        size={bpts.xs ? "small" : "default"}
        current={99}
        // progressDot={customDot}
      >
        {BlockStep}
      </Steps>
    );
  })
);

export default BlockSteps;
