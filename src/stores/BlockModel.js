import { observable, computed } from "mobx";

import moment from "moment";
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
  get now() {
    const endDate = moment(`${moment(this.startDate).year()}-07-01 23:00`);
    if (endDate.isAfter(moment())) {
      return moment().startOf("hour");
    }
    return endDate;
  }

  @computed
  get dates() {
    return [this.startDate, this.firstSpray, this.secondSpray, this.thirdSpray]
      .filter(res => res)
      .map(d => moment(d).valueOf());
  }

  // to deselect dates in the DatePicker
  @computed
  get lastSelectableDate() {
    if (this.datesIdxForGraph) {
      if (
        this.datesIdxForGraph.length === 0 ||
        this.datesIdxForGraph.length === 1
      ) {
        return this.startDate;
      }
      if (this.datesIdxForGraph.length > 1) {
        return this.dates[this.dates.length - 1];
      }
    }
  }

  @computed
  get preData() {
    if (this.startDate && this.avgStyleLength) {
      const startHour = getHours(this.startDate);
      const data = this.data.slice(startHour);

      let cumulativeHrGrowth = 0;
      let percentage = 0;

      return data.map((arr, i) => {
        const { date, temp } = arr;
        const { hrGrowth, temps } = this.variety;

        let hourlyGrowth = 0;
        if (temp > 34 && temp < 106 && temp !== "M") {
          const idx = temps.findIndex(t => t.toString() === temp);
          hourlyGrowth = hrGrowth[idx];
        }

        let isSelected = false;
        const isOneOfTheDates = this.dates.some(
          d => moment(date).valueOf() === d
        );
        if (isOneOfTheDates) {
          cumulativeHrGrowth = 0;
          percentage = 0;
          hourlyGrowth = 0;
          isSelected = true;
        }

        let name = "";
        if (moment(date).isSame(moment().startOf("hour"))) {
          isSelected = true;
          name = "Now";
        }

        if (moment(date).isSame(moment(this.startDate))) name = "Start";
        if (moment(date).isSame(moment(this.firstSpray))) name = "1st Spray";
        if (moment(date).isSame(moment(this.secondSpray))) name = "2nd Spray";
        if (moment(date).isSame(moment(this.thirdSpray))) name = "3rd Spray";

        cumulativeHrGrowth += hourlyGrowth;
        percentage = cumulativeHrGrowth / this.avgStyleLength * 100;

        return {
          index: i,
          date,
          name,
          hourlyGrowth,
          isSelected,
          temperature: isNaN(Number(temp)) ? "No Data" : Number(temp),
          cHrGrowth: Number(cumulativeHrGrowth.toFixed(3)),
          emergence: Number(percentage.toFixed(0)),
          avgSL: Number(this.avgStyleLength)
        };
      });
    }
  }

  @computed
  get todayIdx() {
    if (this.preData) {
      return this.preData.find(obj => obj.name === "Now").index;
    }
  }

  @computed
  get todayEmergence() {
    if (this.preData) {
      return this.preData.find(obj => obj.name === "Now").emergence;
    }
  }

  @computed
  get idxAtThreshold() {
    if (this.todayEmergence < 100) {
      const emergValues = this.preData.map(obj => obj.emergence);
      let thold = 100;
      if (thold !== 80) {
        while (emergValues.lastIndexOf(thold) === -1) {
          thold--;
        }
      }
      return emergValues.lastIndexOf(thold);
    }
  }

  @computed
  get modelData() {
    if (this.preData) {
      return this.preData.map((obj, i) => {
        if (i === this.idxAtThreshold) {
          obj.isSelected = true;
          obj.name = "Forecast";
        }
        return obj;
      });
    }
  }

  @computed
  get modelDataOfSelectedDates() {
    if (this.modelData) {
      return this.modelData.filter(day => day.isSelected);
    }
  }

  @computed
  get datesIdxForGraph() {
    if (this.modelData) {
      const arr = this.modelDataOfSelectedDates.map(obj => obj.index);
      if (isThisYear(this.startDate) && this.todayEmergence < 100) {
        const startAndSprays = arr.slice(1, -2);
        const startAndSpraysMinusOne = startAndSprays.map(i => i - 1);
        const nowAndForecast = arr.slice(-2);
        return [...startAndSpraysMinusOne, ...nowAndForecast];
      }

      const startAndSprays = arr.slice(1, -1);
      const startAndSpraysMinusOne = startAndSprays.map(i => i - 1);
      const now = arr.slice(-1);
      return [...startAndSpraysMinusOne, ...now];
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
