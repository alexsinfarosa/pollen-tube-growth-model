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
  observer(function StyleLengthModal({ app: { bStore }, breakpoints, bl }) {
    const {
      block,
      updateBlock,
      radioValue,
      setRadioValue,
      isStyleLengthModal,
      styleLength,
      setStyleLength,
      addOneStyleLength,
      addAvgStyleLength,
      removeStyleLength,
      editStyleLength,
      isStyleLengthBeingEdited,
      updateOneStyleLength,
      cancelButton
    } = bStore;

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
        width: "45%",
        render: (text, record) => <span>{text.toPrecision(4)} mm</span>
      },
      {
        title: "Actions",
        dataIndex: "actions",
        width: "25%",
        render: (text, record, idx) => (
          <div>
            <Icon type="edit" onClick={() => editStyleLength(record, idx)} />
            <Divider type="vertical" />
            <Icon
              type="delete"
              onClick={() => removeStyleLength(record, idx)}
            />
          </div>
        )
      }
    ];

    const Footer = d => {
      return (
        <Row>
          <Col>
            <Button onClick={cancelButton}>Cancel</Button>
            <Button
              disabled={
                (radioValue === "calculate" && block.styleLengths.length < 4) ||
                isStyleLengthBeingEdited
              }
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

    const average = bl.avgStyleLength
      ? `: ${bl.avgStyleLength.toPrecision(4)} (mm)`
      : "";

    return (
      <Modal
        closable={false}
        title={
          radioValue
            ? radioValue === "avg"
              ? `Average Style Length`
              : `Style Lengths ${average}`
            : `Select one of the options:`
        }
        visible={isStyleLengthModal}
        footer={radioValue ? <Footer /> : null}
        onCancel={cancelButton}
      >
        {!radioValue && (
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
                <Radio checked={radioValue === "avg"} value="avg">
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
            style={{ width: "99%", marginLeft: 1 }}
            onChange={e => setStyleLength(e)}
            placeholder="Insert average style length (mm)"
            min={1}
            max={20}
            step={0.01}
            precision={3}
            value={styleLength}
          />
        )}

        {radioValue === "calculate" && (
          <Row>
            <Col>
              <Row type="flex" align="middle">
                <Col span={20}>
                  <InputNumber
                    style={{ width: "100%", marginBottom: 16 }}
                    onChange={e => setStyleLength(e)}
                    placeholder="Add Style Length"
                    min={1}
                    max={20}
                    step={0.01}
                    precision={3}
                    value={styleLength}
                  />
                </Col>
                <Col span={4}>
                  {radioValue === "calculate" && (
                    <Button
                      style={{ width: "100%", marginBottom: 16 }}
                      disabled={!styleLength}
                      type={isStyleLengthBeingEdited ? "primary" : "secondary"}
                      onClick={
                        isStyleLengthBeingEdited
                          ? updateOneStyleLength
                          : addOneStyleLength
                      }
                    >
                      {isStyleLengthBeingEdited ? "UPDATE" : "ADD"}
                    </Button>
                  )}
                </Col>
              </Row>
            </Col>
            <Col>
              <Table
                rowClassName={record =>
                  record.isEdit ? "table selected" : "table"
                }
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
