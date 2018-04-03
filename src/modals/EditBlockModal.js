import React from "react";
import { inject, observer } from "mobx-react";
import moment from "moment";
// import isEqual from "date-fns/is_equal";

// antd
import { Row, Modal, Input, Select, Button, DatePicker } from "antd";
const style = { width: "100%", marginBottom: 16 };

const EditBlockModal = inject("app")(
  observer(function EditBlockModal({
    app: { apples, states, stations, currentStateStations, bStore, block },
    bl
  }) {
    // disable dates
    const disablePreviousSprayDates = (prev, curr) => {
      if (prev) {
        return curr && curr < moment(prev).endOf("day");
      }
      return curr && curr.valueOf() > Date.now();
    };

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
            onClick={bStore.fetchAndUploadData}
          >
            Update Block
          </Button>
        </div>
      );
    };

    return (
      <Modal
        style={{ top: 32 }}
        closable={false}
        maskClosable={false}
        title="Edit Block"
        visible={bStore.isEditBlockModal}
        footer={<Footer />}
      >
        <Row align="middle">
          <label>Name:</label>
          <Input
            name="name"
            style={style}
            placeholder="Insert block name (min. 3 letters)"
            onChange={e => bStore.addField(e.target.name, e.target.value)}
            value={block.name ? block.name : undefined}
          />

          <label>Variety: </label>
          <Select
            style={style}
            placeholder={`Select apple variety`}
            onChange={val => bStore.addField("variety", val)}
            value={block.variety ? block.variety.name : undefined}
          >
            {varietyList}
          </Select>

          <label>State: </label>
          <Select
            name="state"
            style={style}
            placeholder={`Select state`}
            onChange={val => bStore.addField("state", val)}
            value={block.state ? block.state.postalCode : undefined}
          >
            {stateList}
          </Select>

          <label>Station:</label>
          <Select
            name="station"
            style={style}
            placeholder={stationCount}
            onChange={val => bStore.addField("station", val)}
            value={block.station ? block.station.name : undefined}
          >
            {stationList}
          </Select>

          <label>Start Date: </label>
          <DatePicker
            name="startDate"
            showTime={{ format: "HH:00" }}
            disabled={bl.startDate ? false : true}
            style={style}
            value={block.startDate ? moment(block.startDate) : undefined}
            allowClear={false}
            format="MMM Do YYYY, HH:00"
            placeholder={`Select Date and Time`}
            disabledDate={curr => disablePreviousSprayDates(undefined, curr)}
            showToday={true}
            onChange={date => bStore.addField("startDate", date)}
          />

          <label>First Spray: </label>
          <DatePicker
            name="firstSpray"
            showTime={{ format: "HH:00" }}
            disabled={bl.dates.length > 1 ? false : true}
            style={style}
            value={block.firstSpray ? moment(block.firstSpray) : undefined}
            allowClear={true}
            format="MMM Do YYYY, HH:00"
            placeholder={`Select Date and Time`}
            disabledDate={curr => disablePreviousSprayDates(bl.startDate, curr)}
            showToday={true}
            onChange={date =>
              date === null
                ? bStore.addField("firstSpray", undefined)
                : bStore.addField("firstSpray", date)
            }
          />

          <label>Second Spray: </label>
          <DatePicker
            name="secondSpray"
            showTime={{ format: "HH:00" }}
            disabled={bl.dates.length > 2 ? false : true}
            style={style}
            value={block.secondSpray ? moment(block.secondSpray) : undefined}
            allowClear={true}
            format="MMM Do YYYY, HH:00"
            placeholder={`Select Date and Time`}
            disabledDate={curr =>
              disablePreviousSprayDates(bl.firstSpray, curr)
            }
            showToday={true}
            onChange={date =>
              date === null
                ? bStore.addField("secondSpray", undefined)
                : bStore.addField("secondSpray", date)
            }
          />

          <label>Third Spray: </label>
          <DatePicker
            name="thirdSpray"
            showTime={{ format: "HH:00" }}
            disabled={bl.dates.length > 3 ? false : true}
            style={style}
            value={block.thirdSpray ? moment(block.thirdSpray) : undefined}
            allowClear={true}
            format="MMM Do YYYY, HH:00"
            placeholder={`Select Date and Time`}
            disabledDate={curr =>
              disablePreviousSprayDates(bl.secondSpray, curr)
            }
            showToday={true}
            onChange={date =>
              date === null
                ? bStore.addField("thirdSpray", undefined)
                : bStore.addField("thirdSpray", date)
            }
          />

          <label>End Date: </label>
          <DatePicker
            name="endDate"
            showTime={{ format: "HH:00" }}
            // disabled={bl.countDates > 1 ? false : true}
            style={style}
            value={block.endDate ? moment(block.endDate) : undefined}
            allowClear={false}
            format="MMM Do YYYY, HH:00"
            placeholder={`Select Date and Time`}
            // disabledDate={curr => disablePreviousSprayDates(undefined, curr)}
            showToday={true}
            onChange={date => bStore.addField("endDate", date)}
          />
        </Row>
      </Modal>
    );
  })
);

export default EditBlockModal;
