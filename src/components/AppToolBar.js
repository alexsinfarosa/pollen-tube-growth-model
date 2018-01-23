import React from "react";
import { inject, observer } from "mobx-react";
import getYear from "date-fns/get_year";

import { Col } from "styles";
import { Row, Tooltip, Button, Badge, Select } from "antd";
const { Option, OptGroup } = Select;

const AppToolBar = inject("app")(
  observer(function AppToolBar({
    app: { bStore, blocks, filteredBlocks },
    breakpoints
  }) {
    const bpts = breakpoints;

    // Categorize blocks based on their year
    const setYears = new Set(blocks.map(block => getYear(block.startDate)));
    const arrYears = Array.from(setYears);

    const blockList = arrYears.map((y, i) => {
      const year = y.toString();
      return (
        <OptGroup key={i} label={year === "NaN" ? "Start Date Not Set" : year}>
          {blocks.map((block, j) => {
            const blockYear = getYear(block.startDate).toString();
            if (year === blockYear) {
              return (
                <Option key={block.id} value={block.id}>
                  {block.name}
                </Option>
              );
            }
            return null;
          })}
        </OptGroup>
      );
    });

    return (
      <Row type="flex" style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Row type="flex">
            <Tooltip title="New block">
              <Button
                type="primary"
                ghost
                icon="plus"
                style={{ marginRight: 16 }}
                onClick={() => bStore.showModal("isNewBlockModal")}
              >
                {bpts.xs ? null : "Block"}
              </Button>
            </Tooltip>

            <Tooltip title="Display all blocks">
              <Button
                ghost={filteredBlocks.length > 1 ? false : true}
                type="primary"
                icon={bpts.xs ? "table" : null}
                onClick={bStore.selectAllBlocks}
              >
                {bpts.xs ? null : "Blocks"}
                {!bpts.xs && (
                  <Badge
                    overflowCount={99}
                    count={bStore.blocks.length}
                    style={{
                      marginLeft: 6,
                      marginBottom: 1,
                      background: "#fff",
                      color: "#616161",
                      boxShadow: "0 0 0 1px #d9d9d9 inset"
                    }}
                  />
                )}
              </Button>
            </Tooltip>
          </Row>
        </Col>

        <Col span={18}>
          <Select
            style={{ width: "100%" }}
            placeholder={`Block List`}
            onChange={id => bStore.selectOneBlock(id)}
            value={
              filteredBlocks.length === 1 ? filteredBlocks[0].name : undefined
            }
          >
            {blockList}
          </Select>
        </Col>
      </Row>
    );
  })
);

export default AppToolBar;
