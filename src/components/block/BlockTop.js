import React from "react";
import { inject, observer } from "mobx-react";

// antd
import { Col, Progress } from "antd";

import { BlockBodyWrapper, RowCentered } from "styles";

const formatEmergence = d => {
  if (d === 100) return "Spray!";
  return `${d}%`;
};

const BlockTop = inject("app")(
  observer(function BlockTop({ app, breakpoints, bl }) {
    let currentPercentage = 0;
    if (bl.modelData.length !== 0) {
      currentPercentage = bl.modelData[bl.modelData.length - 1].percentageSpray;
    }
    return (
      <Col
        xs={16}
        sm={24}
        md={24}
        lg={24}
        style={{ marginBottom: breakpoints.xs ? 16 : 32 }}
      >
        <BlockBodyWrapper>
          <Col
            xs={24}
            sm={8}
            md={8}
            lg={8}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
              flex: "1 1 auto"
            }}
          >
            <RowCentered>
              {breakpoints.xs ? (
                <Col
                  span={24}
                  style={{
                    height: 110,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <small>
                    Avg. Style Length: {bl.avgStyleLength.toPrecision(4)} (mm)
                  </small>
                </Col>
              ) : (
                <Col span={24}>
                  Avg. Style Length: {bl.avgStyleLength.toPrecision(4)} (mm)
                </Col>
              )}
            </RowCentered>
          </Col>

          <Col xs={0} sm={8} md={8} lg={8} style={{ padding: 5 }}>
            <RowCentered>
              <Col>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
                neque dolor illo laboriosam esse optio, sed nihil aspernatur
                dignissimos aperiam libero sequi excepturi cumque quia iste
              </Col>
            </RowCentered>
          </Col>

          <Col
            xs={24}
            sm={8}
            md={8}
            lg={8}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
              flex: "1 1 auto"
            }}
          >
            <RowCentered column>
              <Col style={{ marginBottom: 8 }}>
                <small>Emergence</small>
              </Col>
              <Col>
                <Progress
                  type="circle"
                  percent={Math.round(currentPercentage, 1)}
                  // percent={100}
                  format={d => formatEmergence(d)}
                  width={80}
                />
              </Col>
            </RowCentered>
          </Col>
        </BlockBodyWrapper>
      </Col>
    );
  })
);

export default BlockTop;
