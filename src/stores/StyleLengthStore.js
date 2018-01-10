import { observable, action } from "mobx";

class StyleLength {
  block;
  id;
  @observable idx;
  @observable styleLength;
  @observable isEdit;

  constructor(block, id, idx, styleLength, isEdit) {
    this.block = block;
    this.id = id;
    this.idx = idx;
    this.styleLength = styleLength;
    this.isEdit = isEdit;
  }

  destroy() {
    this.block.styleLengths.remove(this);
  }

  setStyleLength(sl) {
    this.styleLength = sl;
  }

  toJS() {
    return {
      id: this.id,
      idx: this.idx,
      styleLength: this.styleLength,
      isEdit: this.isEdit
    };
  }

  static fromJS(block, obj) {
    return new StyleLength(block, obj.id, obj.idx, obj.styleLength, obj.isEdit);
  }
}

export default class StyleLengthStore {
  app;
  constructor(app) {
    this.app = app;
  }

  @observable styleLengths = [];

  addStyleLength(sl) {
    let highiestIdx = 0;
    if (this.styleLengths.length !== 0) {
      const tempArr = this.styleLengths.map(obj => obj.idx);
      highiestIdx = Math.max(...tempArr);
    }
    this.styleLengths.push(
      new StyleLength(this, Date.now(), highiestIdx + 1, false)
    );
  }

  toJS() {
    return this.styleLengths.map(styleLength => styleLength.toJS());
  }

  static fromJS(array) {
    const styleLengthStore = new StyleLengthStore();
    styleLengthStore.styleLengths = array.map(item =>
      StyleLength.fromJS(styleLengthStore, item)
    );
    return styleLengthStore;
  }
}
