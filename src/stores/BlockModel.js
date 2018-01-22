import { observable, computed } from "mobx";

// utils
import { roundDate } from "utils/utils";

import moment from "moment";
import getHours from "date-fns/get_hours";
import format from "date-fns/format";
// import getYear from "date-fns/get_year";
// import isAfter from "date-fns/is_after";
// import isBefore from "date-fns/is_before";
// import addDays from "date-fns/add_days";
import isEqual from "date-fns/is_equal";

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

  @computed
  get now() {
    return roundDate(new Date(), moment.duration(60, "minutes"), "floor");
  }

  @computed
  get dates() {
    return [
      this.startDate,
      this.firstSpray,
      this.secondSpray,
      this.thirdSpray
    ].filter(date => date);
  }

  @computed
  get todayIdx() {
    if (this.modelData) {
      return this.modelData.findIndex(obj =>
        isEqual(new Date(obj.date), new Date(this.now))
      );
    }
  }

  @computed
  get todayEmergence() {
    if (this.modelData) {
      return this.modelData[this.todayIdx]["Emergence"];
    }
  }

  @computed
  get lastDayIdx() {
    if (this.modelData) {
      return this.modelData.length - 1;
    }
  }

  @computed
  get lastDayEmergence() {
    if (this.modelData) {
      return this.modelData[this.modelData.length - 1]["Emergence"];
    }
  }

  @computed
  get lastDate() {
    if (this.modelData) {
      return this.modelData[this.modelData.length - 1].date;
    }
  }

  @computed
  get idxAtThreshold() {
    if (this.todayEmergence < 100) {
      const emergValues = this.modelData.map(obj => obj.Emergence);
      let thold = 100;
      if (thold !== 80) {
        while (emergValues.lastIndexOf(thold) === -1) {
          console.log("while loop");
          thold--;
        }
      }
      return emergValues.lastIndexOf(thold);
    }
  }

  @computed
  get dateAtThreshold() {
    if (this.idxAtThreshold) {
      return this.modelData[this.idxAtThreshold].date;
    }
  }

  @computed
  get datesForGraph() {
    // returns an array of dates with the same format as modelData.date
    if (this.modelData) {
      const dates = [...this.dates, this.now, this.dateAtThreshold];
      // console.log(dates);
      return dates.map(date => format(date, "YYYY-MM-DD HH:00"));
    }
  }

  @computed
  get datesIdxForGraph() {
    if (this.datesForGraph) {
      const idxArr = this.datesForGraph
        .map(date => this.modelData.findIndex(obj => obj.date === date))
        .map(date => date - 1);
      idxArr[0] = idxArr[0] + 1;
      idxArr[idxArr.length - 1] = idxArr[idxArr.length - 1] + 1;
      idxArr[idxArr.length - 2] = idxArr[idxArr.length - 2] + 1;
      return [...idxArr.slice(0, -1), this.idxAtThreshold];
    }
  }

  @computed
  get modelData() {
    if (this.data.length !== 0) {
      if (this.startDate && this.avgStyleLength) {
        const startHour = getHours(this.startDate);
        const data = this.data.slice(startHour);

        // let cumulativeHrGrowth = 0;
        // let percentage = 0;

        let cumulativeHrGrowthPartial = 0;
        let percentagePartial = 0;

        return data.map((arr, i) => {
          const { date, temp } = arr;
          const { hrGrowth, temps } = this.variety;

          const idx = temps.findIndex(t => t.toString() === temp);
          let hourlyGrowth = hrGrowth[idx];
          if (temp < 35 || temp > 106 || temp === "M") hourlyGrowth = 0;

          const isOneOfTheDates = this.dates.some(d => isEqual(date, d));
          if (isOneOfTheDates) {
            cumulativeHrGrowthPartial = 0;
            percentagePartial = 0;
          }

          cumulativeHrGrowthPartial += hourlyGrowth;
          percentagePartial =
            cumulativeHrGrowthPartial / this.avgStyleLength * 100;

          // cumulativeHrGrowth += hourlyGrowth;
          // percentage = cumulativeHrGrowth / this.avgStyleLength * 100;

          return {
            date,
            Date: format(date, "MMM DD HH:00"),
            HourlyGrowth: hourlyGrowth,
            Temperature: isNaN(Number(temp)) ? "No Data" : Number(temp),
            "Cumulative Hourly Growth": Number(
              cumulativeHrGrowthPartial.toFixed(3)
            ),
            Emergence: Number(percentagePartial.toFixed(0)),
            "Average Style Length": Number(this.avgStyleLength)
          };
        });
      }
    }
  }

  @computed
  get modelDataUpTo100() {
    if (this.todayEmergence < 100) {
      return this.modelData.slice(0, this.idxAtThreshold + 1);
    } else {
      return this.modelData;
    }
  }
}
