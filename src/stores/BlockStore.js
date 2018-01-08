import { observable, action, computed, when } from "mobx";

class Block {
  id;
  @observable name;
  @observable variety;
  @observable state;
  @observable station;
  @observable styleLengths;
  @observable dates;
  @observable data;
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
    isBeingEdited
  }) {
    this.name = name;
    this.variety = variety;
    this.state = state;
    this.station = station;
    this.styleLengths = styleLengths;
    this.dates = dates;
    this.data = data;
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
      when(() => this.blocks.size === 0, () => this.readFromLocalStorage());
    }
  }

  @observable isBlockModal = false;
  @action showBlockModal = () => (this.isBlockModal = true);
  @action hideBlockModal = () => (this.isBlockModal = false);

  blocks = observable.map();
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
      const entry = new Block(this.block);
      entry.id = id;
      this.blocks.set(id, entry);
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
    block.isBeingEdited = false;
  };

  @action
  removeBlock = id => {
    this.blocks.delete(id);
    this.writeToLocalStorage();
  };

  @action
  updateBlock = id => {
    if (this.areRequiredFieldsSet) {
      this.block.isBeingEdited = false;
      this.blocks.entries().forEach((key, val) => (this.blocks[key] = val));
      this.writeToLocalStorage();
      this.cancelButton(); //refactor
    }
  };

  @action
  editBlock = id => {
    const blockBeingEdited = this.blocks.get(id);
    blockBeingEdited.isBeingEdited = true;
    this.block = blockBeingEdited;
    this.showBlockModal();
  };

  @action
  writeToLocalStorage = () => {
    window.localStorage.setItem(
      "pollenTubeModelBlocks",
      JSON.stringify([...this.blocks.entries()])
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
        this.blocks.set(json[0], json[1]);
      });
    }
  };
}
