import React from "react";
import { inject, observer } from "mobx-react";
import moment from "moment";
import isEqual from "date-fns/is_equal";

// antd
import { Row, Modal, Input, Select, Button, DatePicker } from "antd";
const style = { width: "100%", marginBottom: 16 };

// const disabledStartDate = current => {
//   // const { date } = this.props;
//   // Try Date.now(date)
//   return current && current.valueOf() > Date.now();
// };

const disabledSprayDate = current => {
  return;
};

const EditBlockModal = inject("app")(
  observer(function EditBlockModal({
    app: { apples, states, currentStateStations, bStore, stations },
    bl
  }) {
    const dates = bl.dates.filter(date => date);
    const countDates = dates.length;
    // const lastDate = dates[countDates - 1];
    // console.log(dates, lastDate);
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
          <Button onClick={() => bStore.hideModal("isEditBlockModal")}>
            Cancel
          </Button>
          <Button
            disabled={!bStore.areRequiredFieldsSet}
            type="primary"
            onClick={bStore.fetchAndUploadData}
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
        maskClosable={true}
        title={bl.isBeingEdited ? `Edit Block` : `New Block`}
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
            value={bl.name}
          />

          <label>Variety: </label>
          <Select
            style={style}
            placeholder={`Select apple variety`}
            onChange={val => bStore.addField("variety", val)}
            value={bl.variety.name}
          >
            {varietyList}
          </Select>

          <label>State: </label>
          <Select
            name="state"
            style={style}
            placeholder={`Select state`}
            onChange={val => bStore.addField("state", val)}
            value={bl.state.postalCode}
          >
            {stateList}
          </Select>

          <label>Station:</label>
          <Select
            name="station"
            style={style}
            placeholder={stationCount}
            onChange={val => bStore.addField("station", val)}
            value={bl.station.name}
          >
            {stationList}
          </Select>

          <label>Start Date: </label>
          <DatePicker
            name="startDate"
            style={style}
            showTime={{ format: "HH:00" }}
            value={bl.startDate ? moment(bl.startDate) : undefined}
            allowClear={false}
            format="MMM Do YYYY, HH:00"
            placeholder={`Select Date and Time`}
            disabledDate={current => current && current.valueOf() > Date.now()}
            showToday={true}
            onChange={date => bStore.addField("startDate", date)}
          />

          <label>First Spray: </label>
          <DatePicker
            disabled={countDates > 1 ? false : true}
            name="firstSpray"
            style={style}
            showTime={{ format: "HH:00" }}
            value={bl.firstSpray ? moment(bl.firstSpray) : undefined}
            allowClear={false}
            format="MMM Do YYYY, HH:00"
            placeholder={`Select Date and Time`}
            disabledDate={current => disabledSprayDate(current)}
            showToday={true}
            onChange={date => bStore.addField("firstSpray", date)}
          />

          <label>Second Spray: </label>
          <DatePicker
            disabled={countDates > 2 ? false : true}
            name="secondSpray"
            style={style}
            showTime={{ format: "HH:00" }}
            value={bl.secondSpray ? moment(bl.secondSpray) : undefined}
            allowClear={false}
            format="MMM Do YYYY, HH:00"
            placeholder={`Select Date and Time`}
            disabledDate={current => disabledSprayDate(current)}
            showToday={true}
            onChange={date => bStore.addField("secondSpray", date)}
          />

          <label>Third Spray: </label>
          <DatePicker
            disabled={countDates > 3 ? false : true}
            name="thirdSpray"
            style={style}
            showTime={{ format: "HH:00" }}
            value={bl.thirdSpray ? moment(bl.thirdSpray) : undefined}
            allowClear={false}
            format="MMM Do YYYY, HH:00"
            placeholder={`Select Date and Time`}
            disabledDate={current => disabledSprayDate(current)}
            showToday={true}
            onChange={date => bStore.addField("thirdSpray", date)}
          />

          <label>End Date: </label>
          <DatePicker
            name="endDate"
            style={style}
            showTime={{ format: "HH:00" }}
            value={bl.endDate ? moment(bl.endDate) : undefined}
            allowClear={false}
            format="MMM Do YYYY, HH:00"
            placeholder={`Select Date and Time`}
            disabledDate={current => disabledSprayDate(current)}
            showToday={true}
            onChange={date => bStore.addField("endSpray", date)}
          />
        </Row>
      </Modal>
    );
  })
);

export default EditBlockModal;
