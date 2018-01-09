import React from "react";
import { inject, observer } from "mobx-react";

import {
  Row,
  Col,
  Modal,
  Table,
  Divider,
  Radio,
  Button,
  Icon,
  InputNumber
} from "antd";
const RadioGroup = Radio.Group;

const StyleLengthModal = inject("app")(
  observer(function StyleLengthModal({ app: { blockStore }, breakpoints }) {
    const {
      isStyleLengthModal,
      radioValue,
      setRadioValue,
      hideStyleLengthModal,
      addAvgStyleLength,
      setStyleLength,
      addOneStyleLength,
      block,
      updateBlock
    } = blockStore;

    const columns = [
      {
        title: "#",
        dataIndex: "idx",
        key: "idx",
        width: "30%",
        sorter: (a, b) => a.idx - b.idx
        // sortOrder: "descend"
      },
      {
        title: "Style Length",
        dataIndex: "styleLength",
        key: "styleLength",
        // width: "50%",
        render: (text, record) => <span>{text.toPrecision(4)} mm</span>
      }
      // {
      //   title: "Actions",
      //   dataIndex: "actions",
      //   // width: "20%",
      //   render: (text, record, index) => (
      //     <div>
      //       <Icon type="edit" onClick={() => editStyleLength(record, index)} />
      //       <Divider type="vertical" />
      //       <Icon
      //         type="delete"
      //         onClick={() => removeStyleLength(record, index)}
      //       />
      //     </div>
      //   )
      // }
    ];

    const Footer = d => {
      return (
        <Row>
          <Col>
            <Button onClick={() => hideStyleLengthModal()}>Cancel</Button>
            <Button
              disabled={block.styleLengths.length < 2}
              onClick={() =>
                radioValue === "avg" ? addAvgStyleLength() : updateBlock()
              }
              type="primary"
            >
              OK
            </Button>
          </Col>
        </Row>
      );
    };

    const average = block.avgStyleLength
      ? `: ${block.avgStyleLength.toPrecision(4)} (mm)`
      : "";

    return (
      <Modal
        closable={false}
        title={
          radioValue
            ? radioValue === "avg"
              ? `Average Style Length`
              : `Style Lengths (999...)`
            : `Select one of the options:`
        }
        visible={isStyleLengthModal}
        footer={radioValue ? <Footer /> : null}
        onCancel={hideStyleLengthModal}
      >
        {!(radioValue === "avg" || radioValue === "calculate") && (
          <RadioGroup
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
            onChange={e => setRadioValue(e.target.value)}
            defaultValue={null}
          >
            <Row style={{ display: "flex", flexDirection: "column" }}>
              <Col style={{ padding: 16 }}>
                <Radio
                  checked={radioValue === "avg"}
                  // disabled={styleLengths.length > 1}
                  value="avg"
                >
                  Insert average style length
                </Radio>
              </Col>
              <Col style={{ padding: 16 }}>
                <Radio checked={radioValue === "calculate"} value="calculate">
                  Calculate average style length
                </Radio>
              </Col>
            </Row>
          </RadioGroup>
        )}

        {radioValue === "avg" && (
          <InputNumber
            style={{ width: "100%" }}
            onChange={e => setStyleLength(e)}
            placeholder="Insert average style length (mm)"
            min={1}
            max={20}
            step={0.01}
            precision={3}
            // value={styleLength}
          />
        )}

        {radioValue === "calculate" && (
          <Row>
            <Col>
              <Row type="flex" align="middle">
                <Col span={20}>
                  <InputNumber
                    name="name"
                    style={{ width: "100%", marginBottom: 16 }}
                    placeholder="Add Style Length"
                    onChange={e => setStyleLength(e)}
                    // value={block.name}
                  />
                </Col>
                <Col span={4}>
                  {radioValue === "calculate" && (
                    <Button
                      style={{ width: "100%", marginBottom: 16 }}
                      // disabled={!styleLength}
                      onClick={addOneStyleLength}
                    >
                      {false ? "UPDATE" : "ADD"}
                    </Button>
                  )}
                </Col>
              </Row>
            </Col>
            <Col>
              <Table
                rowClassName={record => (record.isEdit ? "selected" : null)}
                rowKey={record => record.idx}
                loading={false}
                dataSource={block.styleLengths.slice()}
                columns={columns}
                size="middle"
                pagination={false}
                scroll={{ y: breakpoints.xs ? "30vh" : "50vh", x: "100%" }}
              />
            </Col>
          </Row>
        )}
      </Modal>
    );
  })
);

export default StyleLengthModal;
