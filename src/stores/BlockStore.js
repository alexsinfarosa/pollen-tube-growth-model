import { observable, action, computed, when } from "mobx";
import moment from "moment";
// import { toJS } from "mobx";

// utils
import { roundDate, dailyToHourlyDates } from "utils/utils";
import { loadACISData } from "utils/cleanFetchedData";

// antd
import { message } from "antd";

import format from "date-fns/format";
import getYear from "date-fns/get_year";
import isAfter from "date-fns/is_after";
import addDays from "date-fns/add_days";

// models
import BlockModel from "./BlockModel";

export default class BlockStore {
  app;
  constructor(app) {
    this.app = app;
    when(() => this.blocks.length === 0, () => this.readFromLocalStorage());
  }
  @observable blocks = [];

  @observable name = "";
  @action setName = d => (this.name = d);

  @observable variety;
  @action setVariety = d => (this.variety = d);
  @computed
  get varietyObject() {
    return this.app.apples.get(this.variety);
  }

  @observable state;
  @action setState = d => (this.state = d);
  @computed
  get stateObject() {
    return this.app.states.get(this.state);
  }

  @observable station;
  @action setStation = d => (this.station = d);
  @computed
  get stationObject() {
    return this.app.stations.get(this.station);
  }

  @action
  addBlock = () => {
    if (this.areRequiredFieldsSet) {
      this.blocks.push(
        new BlockModel(
          this,
          Date.now(),
          this.name,
          this.varietyObject,
          this.stateObject,
          this.stationObject
        )
      );
      this.name = "";
      this.variety = undefined;
      this.state = undefined;
      this.station = undefined;
      this.isBlockModal = false;
      message.success(`${this.name} block has been created!`);
    }
  };

  @action
  updateBlock = () => {
    return "update";
  };
  // Local storage ----------------------------------------------------------------------
  @action
  writeToLocalStorage = () => {
    window.localStorage.setItem(
      "pollenTubeModelBlocks",
      JSON.stringify(this.blocks)
    );
  };

  @action
  readFromLocalStorage = () => {
    const data = JSON.parse(
      window.localStorage.getItem("pollenTubeModelBlocks")
    );
    if (data) {
      this.blocks.clear();
      data.forEach(json => {
        this.blocks.push(new BlockModel(json));
      });
    }
  };
}
