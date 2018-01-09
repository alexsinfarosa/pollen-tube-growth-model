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
  get avgStyleLength() {
    return (
      this.styleLengths.map(obj => obj.styleLength).reduce((p, c) => p + c, 0) /
      this.styleLengths.length
    );
  }

  @computed
  get startDate() {
    if (this.dates.length !== 0) {
      return this.dates[0];
    }
  }
}

export default class BlockStore {
  app;
  constructor(app) {
    this.app = app;
    if (typeof window.localStorage !== "undefined") {
      when(
        () => this.blocks.length === 0,
        () => {
          this.readFromLocalStorage();
          this.blocks.forEach(b => (b.isBeingSelected = true));
        }
      );
    }
  }

  @observable date;
  @action
  setDate = d => {
    this.date = roundDate(d, moment.duration(60, "minutes"), "floor");
  };

  // Modals
  @observable isBlockModal = false;
  @action showBlockModal = () => (this.isBlockModal = true);
  @action hideBlockModal = () => (this.isBlockModal = false);

  @observable isDateModal = false;
  @action
  showDateModal = id => {
    this.isDateModal = true;
    this.block = this.blocks.find(b => b.id === id);
  };
  @action hideDateModal = () => (this.isDateModal = false);

  @observable isStyleLengthModal = false;
  @action
  showStyleLengthModal = id => {
    this.isStyleLengthModal = true;
    this.block = this.blocks.find(b => b.id === id);
  };
  @action
  hideStyleLengthModal = () => {
    this.isStyleLengthModal = false;
    this.radioValue = "";
  };

  @observable radioValue = null;
  @action setRadioValue = d => (this.radioValue = d);

  @observable blocks = [];
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

  @computed
  get areRequiredFieldsSet() {
    const { name, variety, state, station } = this.block;
    return name.length >= 3 && variety && state && station;
  }

  @action
  addField = (name, val) => {
    this.block[name] = val;
  };

  @action
  newBlock = () => {
    if (this.areRequiredFieldsSet) {
      this.block.id = Date.now();
      this.blocks.forEach(block => (block.isBeingSelected = false));
      this.block.isBeingSelected = true;
      this.blocks.push(new Block(this.block));
      this.hideBlockModal();
      this.clearFields();
      this.writeToLocalStorage();
    }
  };

  @action
  clearFields = () => {
    const { block } = this;
    block.id = null;
    block.name = "";
    block.variety = undefined;
    block.state = undefined;
    block.station = undefined;
    block.styleLengths = [];
    block.dates = [];
    block.data = new Map();
    block.isBeingSelected = false;
    block.isBeingEdited = false;
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

  @action
  removeBlock = id => {
    const idx = this.blocks.findIndex(b => b.id === id);
    const block = this.blocks[idx];
    this.blocks.splice(idx, 1);
    this.writeToLocalStorage();
    message.success(`${block.name} block has been deleted!`);
  };

  @action
  updateBlock = (property = this.block.name, block = this.block) => {
    block.isBeingEdited = false;
    const idx = this.blocks.findIndex(b => b.id === block.id);
    this.blocks.splice(idx, 1, block);
    this.blocks = this.blocks;
    this.writeToLocalStorage();
    this.hideBlockModal();
    this.hideStyleLengthModal();
    message.success(`${property} has been updated!`);
  };

  @action
  editBlock = id => {
    const blockBeingEdited = this.blocks.find(b => b.id === id);
    blockBeingEdited.isBeingEdited = true;
    this.block = blockBeingEdited;
    this.showBlockModal();
  };

  @action
  cancelButton = () => {
    this.readFromLocalStorage();
    this.clearFields();
    this.hideBlockModal();
  };

  // Dates ----------------------------------------------------------------------------
  setStartDate = () => {
    const block = { ...this.block };
    block.dates.push(this.date);
    this.updateBlock("Start Date", block);
    this.hideDateModal();
    this.readFromLocalStorage();
  };

  // Style length ---------------------------------------------------------------------
  @observable styleLength;
  setStyleLength = d => (this.styleLength = d);

  @action
  addAvgStyleLength = id => {
    const block = { ...this.block };
    let highiestIdx = 0;
    if (block.styleLengths.length !== 0) {
      const tempArr = block.styleLengths.map(obj => obj.idx);
      highiestIdx = Math.max(...tempArr);
    }
    const styleLengthObj = {
      idx: highiestIdx + 1,
      styleLength: this.styleLength,
      isEdit: false
    };
    block.styleLengths.push(styleLengthObj);
    this.updateBlock("Style Length", block);
    this.hideStyleLengthModal();
    this.readFromLocalStorage();
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
    block.styleLength = null;
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
