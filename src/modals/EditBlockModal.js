import React from "react";
import { inject, observer } from "mobx-react";

// antd
import { Row, Modal, Input, Select, Button } from "antd";
const style = { width: "100%", marginBottom: 32 };

// const disabledStartDate = current => {
//   // const { date } = this.props;
//   // Try Date.now(date)
//   return current && current.valueOf() > Date.now();
// };

const EditBlockModal = inject("app")(
  observer(function EditBlockModal({
    app: { apples, states, currentStateStations, bStore, stations },
    bl
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
    const stationList = stations.map(station => {
      return (
        <Select.Option key={station.id} value={station.id}>
          {station.name}
        </Select.Option>
      );
    });

    let stationCount = "Select Station";
    if (bl.state) {
      if (bl.state.postalCode === "ALL") {
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
            onClick={bStore.updateBlock}
          >
            UpdateBlock
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
        title={bl.isBeingEdited ? `Edit Block` : `New Block`}
        visible={bStore.isBlockModal}
        footer={<Footer />}
      >
        <Row align="middle">
          <Input
            name="name"
            style={style}
            placeholder="Insert block name (min. 3 letters)"
            onChange={e => bStore.addField(e.target.name, e.target.value)}
            value={bl.name}
          />

          <Select
            style={style}
            placeholder={`Select apple variety`}
            onChange={val => bStore.addField("variety", val)}
            value={bl.variety.name}
          >
            {varietyList}
          </Select>

          <Select
            name="state"
            style={style}
            placeholder={`Select state`}
            onChange={val => bStore.addField("state", val)}
            value={bl.state.postalCode}
          >
            {stateList}
          </Select>

          <Select
            name="station"
            style={style}
            placeholder={stationCount}
            onChange={val => bStore.addField("station", val)}
            value={bl.station.name}
          >
            {stationList}
          </Select>
        </Row>
      </Modal>
    );
  })
);

export default EditBlockModal;
