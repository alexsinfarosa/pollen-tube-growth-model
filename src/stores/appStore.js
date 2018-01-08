import { observable, action } from "mobx";
import SubjectStore from "./SubjectStore";
import StateStore from "./StateStore";
import StationStore from "./StationStore";
import BlockStore from "./BlockStore";

export default class AppStore {
  fetch;
  subject;
  acisStates;
  acisStations;
  blockStore;

  constructor(fetcher) {
    this.fetch = fetcher;
    this.subject = new SubjectStore(this);
    this.acisStates = new StateStore(this);
    this.acisStations = new StationStore(this);
    this.blockStore = new BlockStore(this);
  }

  get apples() {
    return this.subject.subjects;
  }

  get states() {
    return this.acisStates.states;
  }

  get stations() {
    return this.acisStations.stations;
  }

  get isLoading() {
    return this.acisStations.isLoading;
  }

  get blocks() {
    return this.blockStore.blocks;
  }

  get block() {
    return this.blockStore.block;
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
