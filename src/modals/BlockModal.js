import React from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
import { Row, Modal, Input, Select } from "antd";

const style = { width: "100%", marginBottom: 32 };

const BlockModal = inject("app")(
  observer(function BlockModal({
    app: { apples, states, stations, block, blockStore, blocks }
  }) {
    const { newBlock, updateBlock } = blockStore;
    // console.log({ ...block });
    // console.log(toJS(blocks));

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
        <Select.Option key={state.postalCode} value={state.postalCode}>
          {state.name}
        </Select.Option>
      );
    });

    // station list
    const stationList = stations.values().map(station => {
      return (
        <Select.Option
          key={station.id}
          value={`${station.name} ${station.id} ${station.network}`}
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
        title={block.isBeingEdited ? `Edit Block` : `New Block`}
        visible={blockStore.isBlockModal}
        okText={block.isBeingEdited ? "UPDATE BLOCK" : "ADD BLOCK"}
        onOk={() => (block.isBeingEdited ? updateBlock(block.id) : newBlock())}
        onCancel={blockStore.cancelButton}
      >
        <Row align="middle">
          <Input
            name="name"
            style={style}
            placeholder="Insert block name"
            onChange={e => blockStore.addField(e.target.name, e.target.value)}
            value={block.name}
          />

          <Select
            style={style}
            placeholder={`Select apple variety`}
            onChange={val => blockStore.addField("variety", val)}
            value={block.variety}
          >
            {varietyList}
          </Select>

          <Select
            name="state"
            style={style}
            placeholder={`Select state`}
            onChange={val => blockStore.addField("state", val)}
            value={block.state}
          >
            {stateList}
          </Select>

          <Select
            name="station"
            style={style}
            placeholder={`Select station`}
            onChange={val => blockStore.addField("station", val)}
            value={block.station}
          >
            {stationList}
          </Select>
        </Row>
      </Modal>
    );
  })
);

export default BlockModal;
