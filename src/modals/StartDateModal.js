import React from "react";
import { inject, observer } from "mobx-react";
// import moment from "moment";

// antd
import { Modal, DatePicker } from "antd";

const StartDateModal = inject("app")(
  observer(function StartDateModal({ app: { bStore }, bl }) {
    const width = window.screen.width;
    // hack! Fix it.
    const margin = (width - 280 - 24) / 2;

    const disablePreviousSprayDates = (prev, curr) => {
      if (curr) {
        return curr.valueOf() < prev.valueOf() && curr;
      }
      return curr && curr.valueOf() > Date.now();
    };

    return (
      <Modal
        width={280}
        closable={false}
        footer={null}
        visible={bStore.isDateModal}
        onCancel={() => bStore.hideModal("isDateModal")}
        bodyStyle={{
          marginLeft: width <= 768 ? `${margin}px` : 0,
          padding: 0
        }}
        style={{
          opacity: 0,
          animation: "none"
        }}
      >
        <DatePicker
          open={bStore.isDateModal}
          showTime={{ format: "HH:00" }}
          // value={moment(bStore.bl.startDate)}
          allowClear={false}
          format="MMM Do YYYY, HH:00"
          placeholder={`Select Date and Time`}
          disabledDate={curr => disablePreviousSprayDates(bl.lastOfDates, curr)}
          showToday={true}
          onChange={date => bStore.addField("startDate", date)}
          onOk={bStore.fetchAndUploadData}
        />
      </Modal>
    );
  })
);

export default StartDateModal;
