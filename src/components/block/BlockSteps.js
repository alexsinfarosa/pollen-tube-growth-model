import React from "react";
import { inject, observer } from "mobx-react";

import { Steps } from "antd";
import format from "date-fns/format";
// import isEqual from "date-fns/is_equal";
import moment from "moment";

const BlockSteps = inject("app")(
  observer(function BlockSteps({ app, bl, breakpoints: bpts }) {
    const Title = ({ obj, isToday }) => {
      return (
        <small style={{ fontSize: "0.8rem", color: isToday ? "black" : null }}>
          {obj.name}
        </small>
      );
    };

    const Description = ({ obj, isToday }) => {
      return (
        <small style={{ color: isToday ? "black" : null }}>
          {format(obj.date, "YY/MM/DD HH:00")}
        </small>
      );
    };

    const Emergence = ({ obj, bpts, isToday }) => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "0.8rem",
            color: isToday ? "black" : null
          }}
        >
          {bpts.xs
            ? `${obj.emergence}%`
            : obj.index === 0 ? null : `${obj.emergence}%`}
        </div>
      );
    };

    const BlockStep = bl.modelDataOfSelectedDates.map((obj, i) => {
      const isToday = moment(obj.date).isSame(moment(bl.now));
      return (
        <Steps.Step
          key={obj.date}
          status={"wait"}
          title={<Title obj={obj} isToday={isToday} />}
          description={<Description obj={obj} isToday={isToday} />}
          icon={<Emergence bpts={bpts} obj={obj} isToday={isToday} />}
        />
      );
    });

    return (
      <Steps
        direction={bpts.xs ? "vertical" : "horizontal"}
        size={bpts.xs ? "small" : "default"}
        current={99}
        // style={{ background: "orange" }}
        // progressDot={customDot}
      >
        {BlockStep}
      </Steps>
    );
  })
);

export default BlockSteps;
