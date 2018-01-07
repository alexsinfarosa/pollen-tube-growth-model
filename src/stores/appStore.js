import { observable, action } from "mobx";
import SubjectStore from "./SubjectStore";

export default class AppStore {
  fetch;
  subject;

  constructor(fetcher) {
    this.fetch = fetcher;
    this.subject = new SubjectStore(this.fetch);
  }
  @observable
  bpts = {
    xs: "(max-width: 575px)",
    sm: "(min-width: 576px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 992px)",
    xl: "(min-width: 1200px)",
    xxl: "(min-width: 1600px)"
  };
  //   Modals ------------------------------------------------------
  @observable isBlockModal = false;
  @action showBlockModal = () => (this.isBlockModal = true);
  @action hideBlockModal = () => (this.isBlockModal = false);

  @observable isStyleLengthModal = false;
  @action showStyleLengthModal = () => (this.isStyleLengthModal = true);
  @action hideStyleLengthModal = () => (this.isStyleLengthModal = false);

  @observable isStartDateModalOpen = false;
  @action showStartDateModal = id => (this.isStartDateModalOpen = true);
  @action hideStartDateModal = () => (this.isStartDateModalOpen = false);

  // Radio button values
  @observable radioValue = null;
  @action setRadioValue = d => (this.radioValue = d);
}
