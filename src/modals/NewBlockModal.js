import React from "react";
import { inject, observer } from "mobx-react";

// antd
import { Row, Modal, Input, Select, Button } from "antd";
const style = { width: "100%", marginBottom: 32 };

const NewBlockModal = inject("app")(
  observer(function NewBlockModal({
    app: { apples, states, currentStateStations, bStore, block, stations }
  }) {
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
      if (block.state.postalCode === "ALL") {
        stationCount = `Select Station (${stations.length})`;
      } else {
        stationCount = `Select Station (${currentStateStations.length})`;
      }
    }

    const Footer = () => {
      return (
        <div>
          <Button onClick={bStore.cancelButton}>Cancel</Button>
          <Button
            disabled={!bStore.areRequiredFieldsSet}
            type="primary"
            onClick={bStore.addBlock}
          >
            Add Block
          </Button>
        </div>
      );
    };

    return (
      <Modal
        style={{ top: 32 }}
        closable={false}
        maskClosable={false}
        title={block.isBeingEdited ? `Edit Block` : `New Block`}
        visible={bStore.isNewBlockModal}
        footer={<Footer />}
      >
        <Row align="middle">
          <Input
            name="name"
            style={style}
            placeholder="Insert block name (min. 3 letters)"
            onChange={e => bStore.addField(e.target.name, e.target.value)}
            value={block.name ? block.name : undefined}
          />

          <Select
            style={style}
            placeholder={`Select apple variety`}
            onChange={val => bStore.addField("variety", val)}
            value={block.variety ? block.variety.name : undefined}
          >
            {varietyList}
          </Select>

          <Select
            name="state"
            style={style}
            placeholder={`Select state`}
            onChange={val => bStore.addField("state", val)}
            value={block.state ? block.state.postalCode : undefined}
          >
            {stateList}
          </Select>

          <Select
            name="station"
            style={style}
            placeholder={stationCount}
            onChange={val => bStore.addField("station", val)}
            value={block.station ? block.station.name : undefined}
          >
            {stationList}
          </Select>
        </Row>
      </Modal>
    );
  })
);

export default NewBlockModal;
