import React from "react";
import { inject, observer } from "mobx-react";
// import moment from "moment";
// import { toJS } from "mobx";
import { Row, Modal, Input, Select, Button } from "antd";

const style = { width: "100%", marginBottom: 32 };

// const disabledStartDate = current => {
//   // const { date } = this.props;
//   // Try Date.now(date)
//   return current && current.valueOf() > Date.now();
// };

const BlockModal = inject("app")(
  observer(function BlockModal({
    app: {
      apples,
      states,
      currentStateStations,
      block,
      bStore,
      blocks,
      stations
    }
  }) {
    const {
      addBlock,
      updateBlock,
      isBlockModal,
      cancelButton,
      addField,
      areRequiredFieldsSet
    } = bStore;

    // variety list
    const varietyList = apples.values().map(variety => {
      return (
        <Select.Option key={variety.name} value={variety.name}>
          {variety.name}
        </Select.Option>
      );
    });

    // state list
    const stateList = states.map(state => {
      return (
        <Select.Option key={state.postalCode} value={state.postalCode}>
          {state.name}
        </Select.Option>
      );
    });

    // station list
    const stationList = currentStateStations.map(station => {
      return (
        <Select.Option key={station.id} value={station.id}>
          {station.name}
        </Select.Option>
      );
    });

    let stationCount = "Select Station";
    if (block.state) {
      if (block.state === "ALL") {
        stationCount = `Select Station (${stations.length})`;
      } else {
        stationCount = `Select Station (${currentStateStations.length})`;
      }
    }

    const Footer = () => {
      return (
        <div>
          <Button onClick={cancelButton}>Cancel</Button>
          <Button
            disabled={!areRequiredFieldsSet}
            type="primary"
            onClick={() => (block.isBeingEdited ? updateBlock() : addBlock())}
          >
            {block.isBeingEdited ? "UpdateBlock" : "Add Block"}
          </Button>
        </div>
      );
    };

    return (
      <Modal
        width={400}
        style={{ top: 32 }}
        closable={false}
        maskClosable={false}
        title={block.isBeingEdited ? `Edit Block` : `New Block`}
        visible={isBlockModal}
        // okText={block.isBeingEdited ? "UpdateBlock" : "Add Block"}
        // onOk={() => (block.isBeingEdited ? updateBlock() : addBlock())}
        // onCancel={cancelButton}
        footer={<Footer />}
      >
        <Row align="middle">
          <Input
            name="name"
            style={style}
            placeholder="Insert block name (min. 3 letters)"
            onChange={e => addField(e.target.name, e.target.value)}
            value={block.name}
          />

          <Select
            style={style}
            placeholder={`Select apple variety`}
            onChange={val => addField("variety", val)}
            value={block.variety ? block.variety.name : undefined}
          >
            {varietyList}
          </Select>

          <Select
            name="state"
            style={style}
            placeholder={`Select state`}
            onChange={val => addField("state", val)}
            value={block.state ? block.state.postalCode : undefined}
          >
            {stateList}
          </Select>

          <Select
            name="station"
            style={style}
            placeholder={stationCount}
            onChange={val => addField("station", val)}
            value={block.station ? block.station.name : undefined}
          >
            {stationList}
          </Select>
        </Row>
      </Modal>
    );
  })
);

export default BlockModal;
