import { observable, action, computed, when } from "mobx";
import moment from "moment";
// import { toJS } from "mobx";

// utils
import { roundDate } from "utils/utils";

// antd
import { message } from "antd";

class Block {
  id;
  @observable name;
  @observable variety;
  @observable state;
  @observable station;
  @observable styleLengths;
  @observable dates;
  @observable data;
  @observable isBeingSelected;
  @observable isBeingEdited;

  constructor({
    id,
    name,
    variety,
    state,
    station,
    styleLengths,
    dates,
    data,
    isBeingSelected,
    isBeingEdited
  }) {
    this.id = id;
    this.name = name;
    this.variety = variety;
    this.state = state;
    this.station = station;
    this.styleLengths = styleLengths;
    this.dates = dates;
    this.data = data;
    this.isBeingSelected = isBeingSelected;
    this.isBeingEdited = isBeingEdited;
  }

  @computed
  get startDate() {
    if (this.dates.length !== 0) {
      return this.dates[0];
    }
  }

  @computed
  get avgStyleLength() {
    if (this.styleLengths.length !== 0) {
      return (
        this.styleLengths
          .map(obj => obj.styleLength)
          .reduce((p, c) => p + c, 0) / this.styleLengths.length
      );
    }
  }
}

export default class BlockStore {
  app;
  constructor(app) {
    this.app = app;
    when(() => this.blocks.length === 0, () => this.readFromLocalStorage());
  }

  // Dates ----------------------------------------------------------------------------
  @observable date;
  @action
  setDate = d => {
    this.date = roundDate(d, moment.duration(60, "minutes"), "floor");
  };
  @action
  setStartDate = () => {
    this.block.dates.push(this.date);
    this.updateBlock();
  };

  // style length
  @observable styleLength;
  setStyleLength = d => (this.styleLength = d);

  // Modals
  @observable isBlockModal = false;
  @observable isDateModal = false;
  @observable isStyleLengthModal = false;
  @action showModal = name => (this[name] = true);

  // radioValue
  @observable radioValue = "";
  @action setRadioValue = d => (this.radioValue = d);

  // blocks
  @observable blocks = [];

  // block
  @observable
  block = {
    id: null,
    name: "",
    variety: undefined,
    state: undefined,
    station: undefined,
    styleLengths: [],
    dates: [],
    data: new Map(),
    isBeingSelected: false,
    isBeingEdited: false
  };

  @action
  clearFields = () => {
    this.date = undefined;
    this.styleLength = undefined;
    this.radioValue = "";
    this.isBlockModal = false;
    this.isDateModal = false;
    this.isStyleLengthModal = false;
    this.block.id = null;
    this.block.name = "";
    this.block.variety = undefined;
    this.block.state = undefined;
    this.block.station = undefined;
    this.block.styleLengths = [];
    this.block.dates = [];
    this.block.data = new Map();
    this.block.isBeingSelected = false;
    this.block.isBeingEdited = false;
    this.readFromLocalStorage();
  };

  @action
  selectBlock = (name, id) => {
    this.showModal(name);
    const block = this.blocks.find(b => b.id === id);
    this.block = block;
  };

  @action
  addField = (name, val) => {
    this.block[name] = val;
  };

  @computed
  get areRequiredFieldsSet() {
    const { name, variety, state, station } = this.block;
    return name.length >= 3 && variety && state && station;
  }

  @action
  addBlock = () => {
    if (this.areRequiredFieldsSet) {
      const block = { ...this.block };
      block.id = Date.now();
      block.isBeingSelected = true;
      this.blocks.push(new Block(block));
      this.writeToLocalStorage();
      this.clearFields();
      message.success(`${block.name} block has been created!`);
    }
  };

  @action
  removeBlock = id => {
    const idx = this.blocks.findIndex(b => b.id === id);
    const block = { ...this.blocks[idx] };
    this.blocks.splice(idx, 1);
    this.writeToLocalStorage();
    message.success(`${block.name} block has been deleted!`);
  };

  @action
  editBlock = id => {
    const block = this.blocks.find(b => b.id === id);
    block.isBeingEdited = true;
    this.block = block;
    this.showModal("isBlockModal");
  };

  @action
  updateBlock = () => {
    const block = { ...this.block };
    const blocks = [...this.blocks];
    block.isBeingEdited = false;
    block.styleLengths.forEach(sl => (sl.isEdit = false));
    const idx = this.blocks.findIndex(b => b.id === block.id);
    blocks.splice(idx, 1, block);
    this.blocks = blocks;
    this.writeToLocalStorage();
    this.clearFields();
    message.success(`${block.name} block has been updated!`);
  };

  @action
  selectOneBlock = id => {
    this.blocks.forEach(block => {
      block.id === id
        ? (block.isBeingSelected = true)
        : (block.isBeingSelected = false);
    });
  };

  @action
  selectAllBlocks = () => {
    const areAllBlocksDisplayed = this.blocks.every(bl => bl.isBeingSelected);
    areAllBlocksDisplayed
      ? this.blocks.forEach(bl => (bl.isBeingSelected = false))
      : this.blocks.forEach(bl => (bl.isBeingSelected = true));
  };

  @action cancelButton = () => this.clearFields();

  // Style length ---------------------------------------------------------------------
  @action
  addAvgStyleLength = () => {
    let highiestIdx = 0;
    if (this.block.styleLengths.length !== 0) {
      const tempArr = this.block.styleLengths.map(obj => obj.idx);
      highiestIdx = Math.max(...tempArr);
    }
    const styleLengthObj = {
      idx: highiestIdx + 1,
      styleLength: this.styleLength,
      isEdit: false
    };
    this.block.styleLengths.push(styleLengthObj);
    this.updateBlock();
  };

  @action
  addOneStyleLength = () => {
    const block = { ...this.block };
    let highiestIdx = 0;
    if (block.styleLengths.length !== 0) {
      const tempArr = block.styleLengths.map(obj => obj.idx);
      highiestIdx = Math.max(...tempArr);
    }

    const styleLengthObj = {
      id: Math.random(),
      idx: highiestIdx + 1,
      styleLength: this.styleLength,
      isEdit: false
    };
    block.styleLengths.push(styleLengthObj);
    this.styleLength = undefined;
  };

  @action
  removeStyleLength = (record, idx) => {
    const styleLengths = [...this.block.styleLengths];
    const below = styleLengths.slice(0, idx);
    const above = styleLengths.slice(idx + 1);
    above.map(obj => (obj.idx = obj.idx - 1));
    const newArr = [...below, ...above];
    this.block.styleLengths = newArr;
  };

  @computed
  get isStyleLengthBeingEdited() {
    return this.block.styleLengths.some(sl => sl.isEdit);
  }

  @action
  editStyleLength = (record, idx) => {
    this.setStyleLength(record.styleLength);
    this.block.styleLengths[idx].isEdit = true;
  };

  @action
  updateOneStyleLength = () => {
    const obj = this.block.styleLengths.find(sl => sl.isEdit === true);
    obj.styleLength = this.styleLength;
    obj.isEdit = false;

    const idx = this.block.styleLengths.findIndex(d => d.id === obj.id);
    this.block.styleLengths.splice(idx, 1, obj);
    this.styleLength = undefined;
  };

  // Local storage ----------------------------------------------------------------------
  @action
  writeToLocalStorage = () => {
    window.localStorage.setItem(
      "pollenTubeModelBlocks",
      JSON.stringify(this.blocks)
    );
  };

  @action
  readFromLocalStorage = () => {
    const data = JSON.parse(
      window.localStorage.getItem("pollenTubeModelBlocks")
    );
    if (data) {
      this.blocks.clear();
      data.forEach(json => {
        this.blocks.push(new Block(json));
      });
    }
  };
}
