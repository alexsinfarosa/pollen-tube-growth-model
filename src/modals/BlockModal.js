import React from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
import { Row, Modal, Input, Select } from "antd";

// Components

const BlockModal = inject("app")(
  observer(function BlockModal({ app, app: { subject } }) {
    const { isBlockModal, hideBlockModal } = app;
    const { subjects } = subject;

    const varietyList = subjects.values().map(variety => {
      return (
        <Select.Option key={variety.id} value={variety.name}>
          {variety.name}
        </Select.Option>
      );
    });

    return (
      <Modal
        width={400}
        style={{ top: 32 }}
        closable={false}
        maskClosable={false}
        // title={block.isBeingEdited ? `Edit selected block` : `New Block`}
        visible={isBlockModal}
        // okText={block.isBeingEdited ? "UPDATE BLOCK" : "ADD BLOCK"}
        // onOk={block.isBeingEdited ? updateBlock : addBlock}
        onCancel={hideBlockModal}
      >
        <Row align="middle">
          <Input
            style={{ width: "100%" }}
            placeholder="Insert block name"
            // onChange={e => setBlockName(e.target.value)}
            // value={blockName}
          />

          <Select
            style={{ width: "100%" }}
            placeholder={`Select apple variety`}
            // onChange={name => setSubject(name)}
            // value={subject.name}
          >
            {varietyList}
          </Select>

          <Select
            style={{ width: "100%" }}
            placeholder={`Select state`}
            // onChange={name => setState(name)}
            // value={state.name}
          />

          <Select
            style={{ width: "100%" }}
            // placeholder={`Select station (${currentStateStations.length})`}
            // onChange={id => setStation(id)}
            // value={station.name}
          />
        </Row>
      </Modal>
    );
  })
);

export default BlockModal;
