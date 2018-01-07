import { observable, action, computed } from "mobx";

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
  }

  @observable isBlockModal = false;
  @action showBlockModal = () => (this.isBlockModal = true);
  @action hideBlockModal = () => (this.isBlockModal = false);

  @observable blocks = new Map();
  @observable
  block = {
    id: null,
    name: "",
    variety: "",
    state: "",
    station: "",
    styleLengths: [],
    dates: undefined,
    data: new Map(),
    isBeingEdited: false
  };

  @action
  addField = (name, val) => {
    this.block[name] = val;
  };

  @action
  newBlock = () => {
    const id = Date.now();
    const entry = new Block(this.block);
    entry.id = id;
    this.blocks.set(id, entry);
    this.hideBlockModal();
  };
}
