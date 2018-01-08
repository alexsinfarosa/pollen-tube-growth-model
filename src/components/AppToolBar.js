import React from "react";
import { inject, observer } from "mobx-react";
import getYear from "date-fns/get_year";

import { ToolBarWrapper, Col } from "styles";
import { Row, Tooltip, Button, Badge, Select } from "antd";
const { Option, OptGroup } = Select;

const AppToolBar = inject("app")(
  observer(function AppToolBar({
    app: { blockStore, isMap, blocks, filteredBlocks },
    breakpoints
  }) {
    const bpts = breakpoints;

    // Categorize blocks based on their year
    const setYears = new Set(blocks.map(block => getYear(block.dates[0])));
    const arrYears = Array.from(setYears);

    const blockList = arrYears.map((y, i) => {
      const year = y.toString();
      return (
        <OptGroup key={i} label={year === "NaN" ? "Date not set" : year}>
          {blocks.map((block, j) => {
            const blockYear = getYear(block.dates[0]).toString();
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
      <ToolBarWrapper>
        <Col>
          <Row type="flex">
            <Tooltip title="New block">
              <Button
                type="primary"
                ghost
                icon="plus"
                style={{ marginRight: 16 }}
                onClick={blockStore.showBlockModal}
              >
                {bpts.xs ? null : "Block"}
              </Button>
            </Tooltip>

            <Tooltip title="Display all blocks">
              <Button
                ghost={filteredBlocks.length > 1 ? false : true}
                type="primary"
                icon={bpts.xs ? "table" : null}
                onClick={blockStore.selectAllBlocks}
              >
                {bpts.xs ? null : "Blocks"}
                {!bpts.xs && (
                  <Badge
                    overflowCount={99}
                    count={blockStore.blocks.length}
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

        <Col style={{ flex: "2 2 200px" }}>
          <Select
            style={{ width: "100%" }}
            placeholder={`Block List`}
            onChange={id => blockStore.selectOneBlock(id)}
            value={
              filteredBlocks.length === 1 ? filteredBlocks[0].name : undefined
            }
          >
            {blockList}
          </Select>
        </Col>

        {!bpts.xs && (
          <Col right>
            <Tooltip title="Toggle Map">
              <Button
                type="primary"
                ghost={isMap ? false : true}
                icon="environment-o"
                // onClick={toggleMap}
              >
                Map
              </Button>
            </Tooltip>
          </Col>
        )}
      </ToolBarWrapper>
    );
  })
);

export default AppToolBar;
