import { observable, action, computed } from "mobx";

import getHours from "date-fns/get_hours";
import format from "date-fns/format";
import getYear from "date-fns/get_year";
import isAfter from "date-fns/is_after";
import isBefore from "date-fns/is_before";
import addDays from "date-fns/add_days";
import isEqual from "date-fns/is_equal";

export default class Block {
  store;
  id;
  @observable name;
  @observable variety;
  @observable state;
  @observable station;
  @observable styleLength;
  @observable startDate;
  @observable firstSpray;
  @observable secondSpray;
  @observable thirdSpray;
  @observable endDate;
  @observable styleLengths = [];
  @observable dates = [];
  @observable data = [];
  @observable isBeingSelected = false;
  @observable isBeingEdited = false;

  constructor(store, id, name, variety, state, station) {
    this.store = store;
    this.id = id;
    this.name = name;
    this.variety = variety;
    this.state = state;
    this.station = station;
  }

  @action setName = d => (this.name = d);
  @action setVariety = d => (this.variety = d);
  @action setState = d => (this.state = d);
  @action setStation = d => (this.station = d);
  @action setStyleLength = d => (this.styleLength = d);
  @action setStartDate = d => (this.startDate = d);
  @action setFirstSpray = d => (this.firstSpray = d);
  @action setSecondSpray = d => (this.secondSpray = d);
  @action setThirdSpray = d => (this.thirdSpray = d);
  @action setEndDate = d => (this.endDate = d);

  @action setData = d => (this.date = d);
  @action setIsBeingSelected = d => (this.isBeingSelected = d);
  @action setIsBeingEdited = d => (this.isBeingEdited = d);
}
