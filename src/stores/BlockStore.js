import { observable, action, computed, when } from "mobx";

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
          this.blocks.forEach(block => (block.isBeingSelected = true));
        }
      );
    }
  }

  @observable isBlockModal = false;
  @action showBlockModal = () => (this.isBlockModal = true);
  @action hideBlockModal = () => (this.isBlockModal = false);

  @observable blocks = [];
  @observable
  block = {
    id: null,
    name: "",
    variety: undefined,
    state: undefined,
    station: undefined,
    styleLengths: [],
    dates: undefined,
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
      const id = Date.now();
      const block = new Block(this.block);
      block.id = id;
      this.blocks.push(block);
      this.selectOneBlock(block.id);
      this.hideBlockModal();
      this.writeToLocalStorage();
      this.clearFields();
    }
  };

  @action
  clearFields = () => {
    const { block } = this;
    block.name = "";
    block.variety = undefined;
    block.state = undefined;
    block.station = undefined;
    block.styleLengths = [];
    block.dates = undefined;
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
    const areAllBlocksDisplayed = this.blocks.every(
      block => block.isBeingSelected === true
    );
    areAllBlocksDisplayed
      ? this.blocks.forEach(block => (block.isBeingSelected = false))
      : this.blocks.forEach(block => (block.isBeingSelected = true));
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
  updateBlock = id => {
    if (this.areRequiredFieldsSet) {
      const block = { ...this.block };
      block.isBeingEdited = false;
      const idx = this.blocks.findIndex(b => b.id === block.id);
      this.blocks.splice(idx, 1, block);
      this.blocks = this.blocks;
      this.writeToLocalStorage();
      this.cancelButton(); //refactor
      message.success(`${block.name} block has been updated!`);
    }
  };

  @action
  editBlock = id => {
    const blockBeingEdited = this.blocks.find(b => b.id === id);
    blockBeingEdited.isBeingEdited = true;
    this.block = blockBeingEdited;
    this.showBlockModal();
  };

  @action
  writeToLocalStorage = () => {
    window.localStorage.setItem(
      "pollenTubeModelBlocks",
      JSON.stringify(this.blocks)
    );
  };

  @action
  cancelButton = () => {
    this.readFromLocalStorage();
    this.clearFields();
    this.hideBlockModal();
  };

  @action
  readFromLocalStorage = () => {
    const data = JSON.parse(
      window.localStorage.getItem("pollenTubeModelBlocks")
    );
    if (data) {
      this.blocks.clear();
      data.forEach(json => {
        this.blocks.push(json);
      });
    }
  };
}
