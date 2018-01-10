import { observable, when } from "mobx";
import SubjectStore from "./SubjectStore";
import StateStore from "./StateStore";
import StationStore from "./StationStore";
import BlockStore from "./BlockStore";

import format from "date-fns/format";

import { loadACISData } from "utils/cleanFetchedData";

import { stationTest } from "utils/testData";
const seasonStartDate = "2017-03-01";
const selectedDate = "2017-05-15";

export default class AppStore {
  fetch;
  subject;
  acisStates;
  acisStations;
  blockStore;
  @observable acisData = new Map();

  constructor(fetcher) {
    this.fetch = fetcher;
    this.subject = new SubjectStore(this);
    this.acisStates = new StateStore(this);
    this.acisStations = new StationStore(this);
    this.blockStore = new BlockStore(this);
    when(
      () => this.blockStationList.length !== 0,
      () =>
        this.blockStationList.forEach(station => {
          this.acisData.set(
            "station",
            loadACISData(station[0], seasonStartDate, selectedDate)
          );
        })
    );
    console.log(this.acisData);
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

  get blockStationList() {
    const stationList = Array.from(new Set(this.blocks.map(bl => bl.station)))
      .map(st => st.split(" "))
      .map(arr => arr.slice(1))
      .map(arr => arr.join(" "));
    console.log(stationList);
    return stationList;
  }

  get isLoading() {
    return this.acisStations.isLoading;
  }

  get blocks() {
    return this.blockStore.blocks;
  }

  get filteredBlocks() {
    return this.blocks.filter(block => block.isBeingSelected);
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

  formatDate = date => {
    return format(date, "MM/DD/YY HH:00");
  };
}
