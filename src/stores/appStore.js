import { observable } from "mobx";
import SubjectStore from "./SubjectStore";
import StateStore from "./StateStore";
import StationStore from "./StationStore";
import BlockStore from "./BlockStore";

// import format from "date-fns/format";

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

  get bStore() {
    return this.blockStore;
  }

  get blocks() {
    return this.blockStore.blocks;
  }

  get filteredBlocks() {
    return this.blocks.filter(block => block.isBeingSelected);
  }

  get currentStateStations() {
    if (this.state) {
      if (this.state.postalCode === "ALL") {
        return this.stations;
      }

      return this.stations.filter(
        station => station.state === this.state.postalCode
      );
    }
    return [];
  }

  get isLoading() {
    return this.blockStore.isLoading;
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
}
