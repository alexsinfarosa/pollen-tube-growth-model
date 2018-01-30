import { observable } from "mobx";
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

    // when(
    //   () => this.acisStations.stations.length !== 0 && this.blocks.length !== 0,
    //   () => this.loadData()
    // );
  }

  // @computed
  // get listOfStationsToFetch() {
  //   const stationList = [...new Set(this.blocks.map(bl => bl.station.name))];
  //   return stationList.map(name => this.stations.find(s => s.name === name));
  // }

  // @action
  // loadData = () => {
  //   console.log("loadData");
  //   this.listOfStationsToFetch.forEach(station => {
  //     // CHANGE THIS...........................................................
  //     const startSeason = moment(`${moment().year()}-01-01`);
  //     loadACISData(station, startSeason, new Date()).then(res => {
  //       this.blocks.forEach(block => {
  //         if (block.station.id === station.id) {
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

  get stations() {
    return this.acisStations.stations;
  }

  get bStore() {
    return this.blockStore;
  }

  get blocks() {
    return this.blockStore.blocks;
  }

  get block() {
    return this.blockStore.block;
  }

  get filteredBlocks() {
    return this.blocks.filter(block => block.isBeingSelected);
  }

  get currentStateStations() {
    if (this.block.state) {
      if (this.block.state.postalCode === "ALL") {
        return this.stations;
      }

      return this.stations.filter(
        station => station.state === this.block.state.postalCode
      );
    }
    return [];
  }

  get isLoading() {
    return this.blockStore.isLoading;
  }

  get deSelectAllBlocks() {
    const areAllBlocksDisplayed = this.blocks.every(bl => bl.isBeingSelected);
    console.log(areAllBlocksDisplayed);
    return areAllBlocksDisplayed;
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
