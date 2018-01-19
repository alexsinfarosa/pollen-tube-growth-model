import React from "react";
import { inject, observer } from "mobx-react";

// antd
import { Modal, DatePicker } from "antd";

const SprayDateModal = inject("app")(
  observer(function SprayDateModal({ app: { formatDate, bStore }, bl }) {
    const width = window.screen.width;
    // hack! Fix it.
    const margin = (width - 280 - 24) / 2;

    return (
      <Modal
        width={280}
        closable={false}
        footer={null}
        visible={bStore.isSprayModal}
        onCancel={() => bStore.hideModal("isSprayModal")}
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
          open={bStore.isSprayModal}
          showTime={{ format: "HH:00" }}
          //  value={moment(bl.dates[0])}
          allowClear={false}
          format="MMM Do YYYY, HH:00"
          placeholder={`Select Date and Time`}
          disabledDate={current => current && current.valueOf() > Date.now()}
          showToday={true}
          onChange={date => bStore.addField("startDate", date)}
          onOk={bStore.fetchAndUploadData}
        />
      </Modal>
    );
  })
);

export default SprayDateModal;
