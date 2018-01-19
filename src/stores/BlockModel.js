import { observable, action, computed } from "mobx";

// utils
import { roundDate, dailyToHourlyDates } from "utils/utils";

// import getHours from "date-fns/get_hours";
// import format from "date-fns/format";
// import getYear from "date-fns/get_year";
// import isAfter from "date-fns/is_after";
// import isBefore from "date-fns/is_before";
// import addDays from "date-fns/add_days";
// import isEqual from "date-fns/is_equal";

export default class BlockModel {
  id;
  @observable name;
  @observable variety;
  @observable state;
  @observable station;
  @observable startDate;
  @observable firstSpray;
  @observable secondSpray;
  @observable thirdSpray;
  @observable endDate;
  @observable styleLengths = [];
  @observable data = [];
  @observable isBeingSelected = false;
  @observable isBeingEdited = false;

  constructor({
    id,
    name,
    variety,
    state,
    station,
    startDate,
    firstSpray,
    secondSpray,
    thirdSpray,
    endDate,
    styleLengths,
    data,
    isBeingSelected,
    isBeingEdited
  }) {
    this.id = id;
    this.name = name;
    this.variety = variety;
    this.state = state;
    this.station = station;
    this.startDate = startDate;
    this.firstSpray = firstSpray;
    this.secondSpray = secondSpray;
    this.thirdSpray = thirdSpray;
    this.endDate = endDate;
    this.styleLengths = styleLengths;
    this.data = data;
    this.isBeingSelected = isBeingSelected;
    this.isBeingEdited = isBeingEdited;
  }

  @computed
  get avgStyleLength() {
    if (this.styleLengths.length !== 0) {
      return (
        this.styleLengths
          .map(obj => obj.styleLength)
          .reduce((p, c) => p + c, 0) / this.styleLengths.length
      );
    }
  }
}
