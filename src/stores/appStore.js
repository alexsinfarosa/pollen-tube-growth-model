import { observable } from "mobx";
import SubjectStore from "./SubjectStore";
import StateStore from "./StateStore";
import StationStore from "./StationStore";
import BlockStore from "./BlockStore";

import format from "date-fns/format";

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
    // if (isAfter(Date.now(), this.seasonStartDate)) {
    // when(
    //   () => !this.isLoading && this.blocks.length !== 0,
    //   () => this.loadData()
    // );
    // // }
  }

  // @action
  // loadData = () => {
  //   console.log("loadData");
  //   this.listOfStationsToFetch.forEach(station => {
  //     loadACISData(station, "2017-03-01", "2017-05-01").then(res => {
  //       this.blocks.forEach(block => {
  //         if (block.station === station.id) {
  //           block.data = dailyToHourlyDates(
  //             Array.from(res.get("cStationClean"))
  //           );
  //         }
  //       });
  //     });
  //   });
  // };

  get apples() {
    return this.subject.subjects;
  }

  get states() {
    return this.acisStates.states;
  }

  get state() {
    return this.block.state;
  }

  get station() {
    return this.blocks.station;
  }

  get stations() {
    return this.acisStations.stations;
  }

  get currentStateStations() {
    if (this.state === "All States") {
      return this.stations;
    }

    return this.stations.filter(station => station.state === this.state);
  }

  // @computed
  // get listOfStationsToFetch() {
  //   const stationList = Array.from(new Set(this.blocks.map(bl => bl.station)));
  //   const stationListObj = stationList.map(station =>
  //     this.stations.find(s => s.id === station)
  //   );
  //   // console.log(stationListObj);
  //   return stationListObj;
  // }

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
