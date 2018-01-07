import React from "react";
import { inject, observer } from "mobx-react";

import { ToolBarWrapper, Col } from "styles";
import { Row, Tooltip, Button, Badge } from "antd";

const AppToolBar = inject("app")(
  observer(function AppToolBar({ app, breakpoints }) {
    const { isMap, showBlockModal } = app;
    const bpts = breakpoints;
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
                onClick={showBlockModal}
              >
                {bpts.xs ? null : "Block"}
              </Button>
            </Tooltip>

            <Tooltip title="Display all blocks">
              <Button
                ghost={true ? false : true}
                type="primary"
                icon={bpts.xs ? "table" : null}
                // onClick={() => displayAllBlocks()}
              >
                {bpts.xs ? null : "Blocks"}
                {!bpts.xs && (
                  <Badge
                    overflowCount={99}
                    count={3}
                    style={{
                      marginLeft: 8,
                      marginBottom: 2,
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

        {/*<Col style={{ flex: "2 2 200px" }}>
      <SelectBlocks />
    </Col>*/}

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
