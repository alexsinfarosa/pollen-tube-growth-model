import { observable, computed } from "mobx";

import moment from "moment";
import format from "date-fns/format";
import isEqual from "date-fns/is_equal";
import getHours from "date-fns/get_hours";
import isThisYear from "date-fns/is_this_year";

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
  @observable isMessage = true;
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
    isMessage,
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
    this.isMessage = isMessage;
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
  get startOfSeason() {
    // CHANGE THIS...........................................................
    return moment(`${moment().year()}-01-01 00:00`);
  }

  @computed
  get now() {
    const endDate = moment(`${moment(this.startDate).year()}-07-01 23:00`);
    if (endDate.isAfter(moment())) {
      return moment().startOf("hour");
    }
    return endDate;
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
  get stepDates() {
    let results = [];
    this.dates.forEach((date, i) => {
      let status = "wait";
      if (i === this.dates.length - 1) status = "finish";
      let name = "";
      if (i === 0) name = "Start Date";
      if (i === 1) name = "First Spray";
      if (i === 2) name = "Second Spray";
      if (i === 3) name = "Third Spray";
      results.push({
        name,
        date,
        status,
        emergence: this.modelData[this.datesIdxForGraph[i]].Emergence
      });
    });

    const today = {
      name: "Today",
      date: this.now,
      status: "finish",
      emergence: this.todayEmergence
    };

    if (isThisYear(this.now)) {
      const forecast = {
        name: "Forecast",
        date: this.dateAtThreshold,
        status: "finish",
        emergence: this.modelData[this.idxAtThreshold].Emergence
      };
      return [...results, today, forecast];
    }

    return [...results, today];
  }

  @computed
  get countDates() {
    return this.dates.length;
  }

  @computed
  get lastSelectableDate() {
    if (this.countDates === 0 || this.countDates === 1) {
      return this.startDate;
    }
    if (this.countDates > 1) {
      return this.dates[this.dates.length - 1];
    }
  }

  @computed
  get lastOfDates() {
    if (this.dates.length !== 0) {
      return moment(this.dates[this.dates.length - 1]);
    }
    return undefined;
  }

  @computed
  get todayIdx() {
    if (this.modelData.length !== 0) {
      return this.modelData.findIndex(obj =>
        isEqual(new Date(obj.date), new Date(this.now))
      );
    }
  }

  @computed
  get todayEmergence() {
    if (this.modelData.length !== 0) {
      return this.modelData[this.todayIdx]["Emergence"];
    }
  }

  @computed
  get lastDayIdx() {
    if (this.modelData.length !== 0) {
      return this.modelData.length - 1;
    }
  }

  @computed
  get lastDayEmergence() {
    if (this.modelData.length !== 0) {
      return this.modelData[this.modelData.length - 1]["Emergence"];
    }
  }

  @computed
  get lastDate() {
    if (this.modelData.length !== 0) {
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
          // console.log("while loop");
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
        // const a = moment(this.startDate);
        // const b = moment(this.startOfSeason);
        // const data = this.data.slice(Math.abs(a.diff(b, "hours")));

        const startHour = getHours(this.startDate);
        const data = this.data.slice(startHour);

        // let cumulativeHrGrowth = 0;
        // let percentage = 0;

        let cumulativeHrGrowthPartial = 0;
        let percentagePartial = 0;

        return data.map((arr, i) => {
          const { date, temp } = arr;
          const { hrGrowth, temps } = this.variety;

          let hourlyGrowth = 0;
          if (temp > 34 && temp < 106 && temp !== "M") {
            const idx = temps.findIndex(t => t.toString() === temp);
            hourlyGrowth = hrGrowth[idx];
          }

          const isOneOfTheDates = this.dates.some(d => isEqual(date, d));
          if (isOneOfTheDates) {
            cumulativeHrGrowthPartial = 0;
            percentagePartial = 0;
            hourlyGrowth = 0;
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
