import React from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
import { Row, Modal, Input, Select } from "antd";

const style = { width: "100%", marginBottom: 32 };

const BlockModal = inject("app")(
  observer(function BlockModal({
    app: { isBlockModal, hideBlockModal, apples, states, stations }
  }) {
    // variety list
    const varietyList = apples.values().map(variety => {
      return (
        <Select.Option key={variety.id} value={variety.name}>
          {variety.name}
        </Select.Option>
      );
    });

    // state list
    const stateList = states.values().map(state => {
      return (
        <Select.Option key={state.postalCode} value={state.name}>
          {state.name}
        </Select.Option>
      );
    });

    // station list
    const stationList = stations.values().map(station => {
      return (
        <Select.Option
          key={`${station.id} ${station.network}`}
          value={station.name}
        >
          {station.name}
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
            style={style}
            placeholder="Insert block name"
            // onChange={e => setBlockName(e.target.value)}
            // value={blockName}
          />

          <Select
            style={style}
            placeholder={`Select apple variety`}
            // onChange={name => setSubject(name)}
            // value={subject.name}
          >
            {varietyList}
          </Select>

          <Select
            style={style}
            placeholder={`Select state`}
            // onChange={name => setState(name)}
            // value={state.name}
          >
            {stateList}
          </Select>

          <Select
            style={style}
            placeholder={`Select station`}
            // onChange={id => setStation(id)}
            // value={station.name}
          >
            {stationList}
          </Select>
        </Row>
      </Modal>
    );
  })
);

export default BlockModal;
