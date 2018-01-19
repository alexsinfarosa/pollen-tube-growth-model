import { observable, action, computed, when } from "mobx";
// import { toJS } from "mobx";

// utils
import { dailyToHourlyDates } from "utils/utils";
import { loadACISData } from "utils/cleanFetchedData";

// antd
import { message } from "antd";

// models
import BlockModel from "./BlockModel";

export default class BlockStore {
  app;
  constructor(app) {
    this.app = app;
    when(() => this.blocks.length === 0, () => this.readFromLocalStorage());
  }

  @observable isLoading = false;

  // Modals
  @observable isBlockModal = false;
  @observable isDateModal = false;
  @observable isStyleLengthModal = false;
  @observable isMap = false;
  @action toggleMap = () => (this.isMap = !this.isMap);
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
    styleLength: undefined,
    startDate: undefined,
    firstSpray: undefined,
    secondSpray: undefined,
    thirdSpray: undefined,
    endDate: undefined,
    styleLengths: [],
    data: [],
    isBeingSelected: false,
    isBeingEdited: false
  };

  @action
  clearFields = () => {
    this.radioValue = "";
    this.isBlockModal = false;
    this.isDateModal = false;
    this.isStyleLengthModal = false;
    this.block.id = null;
    this.block.name = "";
    this.block.variety = undefined;
    this.block.state = undefined;
    this.block.station = undefined;
    this.styleLength = undefined;
    this.block.startDate = undefined;
    this.block.firstSpray = undefined;
    this.block.secondSpray = undefined;
    this.block.thirdSpray = undefined;
    this.block.endDate = undefined;
    this.block.styleLengths = [];
    this.block.data = [];
    this.block.isBeingSelected = false;
    this.block.isBeingEdited = false;
  };

  @action
  selectBlock = (name, id) => {
    this.showModal(name);
    const block = this.blocks.find(b => b.id === id);
    this.block = block;
  };

  @action
  addField = (name, val) => {
    if (name === "variety") {
      this.block[name] = this.app.apples.get(val);
    }
    if (name === "state") {
      this.block[name] = this.app.states.find(s => s.postalCode === val);
    }
    if (name === "station") {
      this.block[name] = this.app.stations.find(s => s.id === val);
    }
    if (name === "name") {
      this.block[name] = val;
    }
  };

  @computed //FIX
  get areRequiredFieldsSet() {
    const { name, variety, state, station } = this.block;
    return name.length >= 3 && variety && state && station;
  }

  @action
  addBlock = () => {
    if (this.areRequiredFieldsSet) {
      const block = { ...this.block };
      block.isBeingSelected = true;
      block.id = Date.now();
      this.blocks.push(new BlockModel(this, block));
      this.selectOneBlock(block.id);
      // this.writeToLocalStorage();
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

  fetchAndUploadData = () => {
    this.isLoading = true;
    const block = { ...this.block };
    const blocks = [...this.blocks];

    loadACISData(block.station, this.startDate, this.now).then(res => {
      block.data = dailyToHourlyDates(Array.from(res.get("cStationClean")));
      const idx = this.blocks.findIndex(b => b.id === block.id);
      blocks.splice(idx, 1, block);
      this.blocks = blocks;
      this.writeToLocalStorage();
      this.clearFields();
      this.isLoading = false;
      message.success(`${block.name} block has been updated!`);
    });
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
    this.selectOneBlock(block.id);
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
    this.isMap = false;
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
        this.blocks.push(new BlockModel(this, json));
      });
    }
  };
}
