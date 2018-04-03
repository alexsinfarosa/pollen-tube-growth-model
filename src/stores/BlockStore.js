import { observable, action, computed, when } from "mobx";
// import { toJS } from "mobx";

// utils
import { dailyToHourlyDates } from "utils/utils";
import { loadACISData } from "utils/cleanFetchedData";

// antd
import { message } from "antd";

// models
import BlockModel from "./BlockModel";

import moment from "moment";
import isThisYear from "date-fns/is_this_year";

export default class BlockStore {
  app;
  constructor(app) {
    this.app = app;
    when(() => this.blocks.length === 0, () => this.readFromLocalStorage());
  }

  // Loading...
  @observable isLoading = false;

  // Modals
  @observable isNewBlockModal = false;
  @observable isEditBlockModal = false;
  @observable isDateModal = false;
  @observable isSprayModal = false;
  @observable isStyleLengthModal = false;
  @observable isMap = false;
  @action toggleMap = () => (this.isMap = !this.isMap);
  @observable isTable = false;
  @action toggleTable = () => (this.isTable = !this.isTable);
  @observable isGraph = false;
  @action toggleGraph = () => (this.isGraph = !this.isGraph);
  @action showModal = name => (this[name] = true);
  @action
  hideModal = (name, id) => {
    this[name] = false;
    this.block.startDate = undefined;
  };

  @observable isInstructions = false;
  @action
  toggleIsInstructions = d => (this.isInstructions = !this.isInstructions);

  // radioValue
  @observable radioValue = "";
  @action setRadioValue = d => (this.radioValue = d);

  // style length
  @observable styleLength;
  setStyleLength = d => (this.styleLength = d);

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
    startDate: undefined,
    firstSpray: undefined,
    secondSpray: undefined,
    thirdSpray: undefined,
    endDate: undefined,
    isMessage: true,
    styleLengths: [],
    data: [],
    isBeingSelected: false,
    isBeingEdited: false
  };

  @action
  clearFields = () => {
    this.styleLength = undefined;
    this.radioValue = "";
    this.isNewBlockModal = false;
    this.isEditBlockModal = false;
    this.isDateModal = false;
    this.isSprayModal = false;
    this.isStyleLengthModal = false;
    this.block.id = null;
    this.block.name = "";
    this.block.variety = undefined;
    this.block.state = undefined;
    this.block.station = undefined;
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
  toggleIsMessage = id => {
    const block = this.blocks.find(b => b.id === id);
    block.isMessage = !block.isMessage;
    const idx = this.blocks.findIndex(b => b.id === block.id);
    this.blocks.splice(idx, 1, new BlockModel(block));
    this.writeToLocalStorage();
  };

  @action
  selectBlock = (name, id) => {
    this.selectOneBlock(id);
    this.showModal(name);
    const b = this.blocks.find(b => b.id === id);
    this.block.id = b.id;
    this.block.name = b.name;
    this.block.variety = b.variety;
    this.block.state = b.state;
    this.block.station = b.station;
    this.block.startDate = b.startDate;
    this.block.firstSpray = b.firstSpray;
    this.block.secondSpray = b.secondSpray;
    this.block.thirdSpray = b.thirdSpray;
    this.block.endDate = b.endDate;
    this.block.isMessage = b.isMessage;
    this.block.styleLengths = b.styleLengths;
    this.block.data = b.data;
    this.block.isBeingSelected = b.isBeingSelected;
    this.block.isBeingEdited = b.isBeingEdited;
  };

  @action
  addField = (name, val) => {
    // console.log(name, val);
    if (name === "name") {
      this.block[name] = val.charAt(0).toUpperCase() + val.slice(1);
    }

    if (
      name === "firstSpray" ||
      name === "secondSpray" ||
      name === "thirdSpray"
    ) {
      val
        ? (this.block[name] = moment(val).startOf("hour"))
        : (this.block[name] = undefined);
    }

    if (name === "startDate") {
      this.block["startDate"] = moment(val).startOf("hour");
      this.block["endDate"] = moment(`${moment(val).year()}-07-01 23:00`);
    }

    if (name === "endDate") {
      this.block["endDate"] = moment(val).startOf("hour");
    }

    if (name === "variety") {
      this.block[name] = this.app.apples.get(val);
    }
    if (name === "state") {
      this.block[name] = this.app.states.find(s => s.postalCode === val);
    }
    if (name === "station") {
      this.block[name] = this.app.stations.find(s => s.id === val);
    }
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
      block.isBeingSelected = true;
      block.id = Date.now();
      this.blocks.push(new BlockModel(block));
      this.selectOneBlock(block.id);
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
    this.clearFields();
    message.success(`${block.name} block has been deleted!`);
  };

  @action
  editBlock = id => {
    // console.log("edit");
    this.selectOneBlock(id);
    const b = this.blocks.find(b => b.id === id);
    this.block.id = b.id;
    this.block.name = b.name;
    this.block.variety = b.variety;
    this.block.state = b.state;
    this.block.station = b.station;
    this.block.startDate = b.startDate;
    this.block.firstSpray = b.firstSpray;
    this.block.secondSpray = b.secondSpray;
    this.block.thirdSpray = b.thirdSpray;
    this.block.endDate = b.endDate;
    this.block.isMessage = b.isMessage;
    this.block.styleLengths = b.styleLengths;
    this.block.data = b.data;
    this.block.isBeingSelected = true;
    this.block.isBeingEdited = b.isBeingEdited;
    this.showModal("isEditBlockModal");
  };

  fetchAndUploadData = () => {
    // console.log("fetchAndUploadData");
    const block = { ...this.block };
    const blocks = [...this.blocks];
    this.isEditBlockModal = false;
    this.isDateModal = false;
    this.isSprayModal = false;
    this.isStyleLengthModal = false;
    this.isMap = false;
    this.isLoading = true;
    let endDate = block.endDate;
    if (
      isThisYear(block.startDate) &&
      moment(block.endDate).isAfter(moment())
    ) {
      endDate = moment().startOf("hour");
    }
    loadACISData(block.station, block.startDate, endDate).then(res => {
      block.data = dailyToHourlyDates(Array.from(res.get("cStationClean")));
      const idx = this.blocks.findIndex(b => b.id === block.id);
      blocks.splice(idx, 1, new BlockModel(block));
      this.blocks = blocks;
      this.selectOneBlock(block.id);
      this.writeToLocalStorage();
      this.clearFields();
      this.isLoading = false;
      message.success(`${block.name} block has been updated!`);
    });
  };

  @action
  updateBlock = () => {
    // console.log("updateBlock");
    const block = { ...this.block };
    block.isBeingEdited = false;
    block.styleLengths.forEach(sl => (sl.isEdit = false));
    const idx = this.blocks.findIndex(b => b.id === block.id);
    const blocks = [...this.blocks];
    blocks.splice(idx, 1, new BlockModel(block));
    this.blocks = blocks;
    this.selectOneBlock(block.id);
    this.writeToLocalStorage();
    this.clearFields();
    this.isNewBlockModal = false;
    this.isEditBlockModal = false;
    this.isDateModal = false;
    this.isSprayModal = false;
    this.isStyleLengthModal = false;
    this.isMap = false;
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

  @observable startIndex = 0;
  @observable endIndex;
  @action
  setRange = ({ startIndex, endIndex }) => {
    this.startIndex = startIndex;
    this.endIndex = endIndex;
  };

  // Local storage ----------------------------------------------------------------------
  @action
  writeToLocalStorage = () => {
    this.block.data = [];
    window.localStorage.setItem(
      "pollenTubeModelBlocks",
      JSON.stringify(this.blocks)
    );
  };

  @action
  readFromLocalStorage = () => {
    // console.log("readFromLocalStorage");
    const data = JSON.parse(
      window.localStorage.getItem("pollenTubeModelBlocks")
    );
    if (data) {
      // console.log(data);
      this.blocks.clear();
      data.forEach(jsonBlock => {
        const b = { ...jsonBlock };
        if (b.startDate) {
          this.isLoading = true;
          let endDate = moment(b.endDate);
          if (isThisYear(b.startDate) && moment(b.endDate).isAfter(moment())) {
            endDate = moment().startOf("hour");
          }
          // console.log(endDate);
          loadACISData(b.station, b.startDate, endDate).then(res => {
            b.data = dailyToHourlyDates(Array.from(res.get("cStationClean")));
            this.isLoading = false;
          });
        }
        b.startDate = b.startDate ? moment(b.startDate) : undefined;
        b.firstSpray = b.firstSpray ? moment(b.firstSpray) : undefined;
        b.secondSpray = b.secondSpray ? moment(b.secondSpray) : undefined;
        b.thirdSpray = b.thirdSpray ? moment(b.thirdSpray) : undefined;
        b.endDate = b.endDate ? moment(b.endDate) : undefined;
        b.isBeingSelected = true;
        this.blocks.push(new BlockModel(b));
      });
    }
  };
}
