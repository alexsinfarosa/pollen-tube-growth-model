import React from "react";
import { inject, observer } from "mobx-react";

// styled components
import { BHeader } from "styles";

// antd
import { Row, Col, Tooltip, Icon, Popconfirm, Divider } from "antd";

import isThisYear from "date-fns/is_this_year";

const BlockHeader = inject("app")(
  observer(function BlockHeader({
    app: { bStore, stations, isLoading },
    breakpoints,
    bl
  }) {
    const { removeBlock, editBlock, selectOneBlock } = bStore;

    return (
      <BHeader>
        <Row type="flex" justify="space-between">
          <Col>
            <a
              onClick={() => selectOneBlock(bl.id)}
              style={{ color: "white", borderBottom: "1px solid white" }}
            >
              {bl.name}
            </a>
          </Col>
          <Col>{bl.variety.name}</Col>
          {!breakpoints.xs && (
            <Col>
              {bl.station.name}, {bl.state.postalCode}
            </Col>
          )}
          {bl.avgStyleLength && (
            <Col>{bl.avgStyleLength.toPrecision(4)} mm</Col>
          )}
          <Col>
            <Row type="flex" justify="space-between">
              {bl.dates.length < 4 &&
                bl.avgStyleLength &&
                bl.startDate &&
                isThisYear(bl.startDate) && (
                  <Col>
                    <Tooltip
                      title={bl.isMessage ? "Hide Message" : "Display Message"}
                    >
                      <a style={{ color: "white" }}>
                        <Icon
                          style={{ marginRight: 3 }}
                          onClick={() => bStore.toggleIsMessage(bl.id)}
                          type={bl.isMessage ? "info-circle" : "info-circle-o"}
                        />
                      </a>
                    </Tooltip>
                  </Col>
                )}

              {!breakpoints.xs &&
                bl.dates.length < 4 &&
                bl.avgStyleLength &&
                bl.startDate &&
                isThisYear(bl.startDate) && (
                  <Col>
                    <Divider type="vertical" />
                  </Col>
                )}

              {!breakpoints.xs && (
                <Col>
                  <Tooltip title="Edit block">
                    <a style={{ color: "white" }}>
                      <Icon
                        type="edit"
                        style={{ marginRight: 3 }}
                        onClick={() => editBlock(bl.id)}
                      />
                    </a>
                  </Tooltip>
                </Col>
              )}

              {!breakpoints.xs && (
                <Col>
                  <Divider type="vertical" />
                </Col>
              )}

              {!breakpoints.xs && (
                <Col>
                  <Popconfirm
                    placement="left"
                    title="Are you sure？"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => removeBlock(bl.id)}
                  >
                    <Tooltip title="Delete block">
                      <a style={{ color: "white" }}>
                        <Icon type="delete" />
                      </a>
                    </Tooltip>
                  </Popconfirm>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </BHeader>
    );
  })
);

export default BlockHeader;
