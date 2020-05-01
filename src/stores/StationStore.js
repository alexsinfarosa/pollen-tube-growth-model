import { observable, action, when } from "mobx";
import axios from "axios";

export default class StationStore {
  app;
  constructor(app) {
    this.app = app;
    when(
      () => this.stations.length === 0,
      () => this.loadStations()
    );
  }

  @observable isLoading = false;
  @observable stations = [];

  @action updateStations = (d) => (this.stations = d);

  @action
  loadStations() {
    this.isLoading = true;
    return axios
      .get(
        `${window.location.protocol}//newa.nrcc.cornell.edu/newaUtil/stateStationList/all`
      )
      .then((res) => {
        this.updateStations(res.data.stations);
        this.isLoading = false;
      })
      .catch((err) => {
        console.log("Failed to load stations", err);
      });
  }

  @action
  setStation = (id) => {
    const station = this.stations.find((station) => station.id === id);
    const state = this.states.find(
      (state) => state.postalCode === station.state
    );
    this.station = station;
    this.setStateFromMap(state);
    this.setIsMap(false);
    localStorage.setItem("station", JSON.stringify(this.station));
  };
}
