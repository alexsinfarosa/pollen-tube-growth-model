import { observable, computed } from "mobx";

import moment from "moment";
import getHours from "date-fns/get_hours";
import isThisYear from "date-fns/is_this_year";
import format from "date-fns/format";

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

  @observable bIsLoading = false;

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
    // const endDate = moment(`${moment(this.startDate).year()}-07-01 23:00`);
    if (isThisYear(this.startDate) && this.endDate.isAfter(moment())) {
      return moment().startOf("hour");
    }

    return this.endDate;
  }

  @computed
  get dates() {
    const res = [
      this.startDate,
      this.firstSpray,
      this.secondSpray,
      this.thirdSpray
    ]
      .filter(res => res)
      .map(date => format(date, "YYYY-MM-DD HH:00"));
    // console.log(res);
    return res;
  }

  // to deselect dates in the DatePicker
  @computed
  get lastSelectableDate() {
    if (this.modelDataOfSelectedDates) {
      if (
        this.modelDataOfSelectedDates.length === 0 ||
        this.modelDataOfSelectedDates.length === 1
      ) {
        return this.startDate;
      }
      if (this.modelDataOfSelectedDates.length > 1) {
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
        let { date, temp } = arr;
        const { hrGrowth, temps } = this.variety;
        temp = Math.round(parseFloat(temp));

        let hourlyGrowth = 0;
        if ((temp > 34 && temp < 106) || isNaN(temp)) {
          const idx = temps.findIndex(t => t === temp);
          hourlyGrowth = hrGrowth[idx];
        }
        let isSelected = false;
        const isOneOfTheDates = this.dates.some(d => d === date);

        if (isOneOfTheDates) {
          cumulativeHrGrowth = 0;
          percentage = 0;
          hourlyGrowth = 0;
          isSelected = true;
        }

        let name = "";
        if (date === format(new Date(), "YYYY-MM-DD HH:00")) {
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
    if (isThisYear(this.startDate)) {
      if (this.preData) {
        const now = this.preData.find(obj => obj.name === "Now");
        return now ? now.index : 0;
      }
    }
  }

  @computed
  get todayEmergence() {
    if (isThisYear(this.startDate)) {
      if (this.preData) {
        const now = this.preData.find(obj => obj.name === "Now");
        if (now) return now.emergence;
        return 0;
      }
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
  get lastDayIdx() {
    if (this.preData) {
      return this.preData.length - 1;
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

        if (i === this.lastDayIdx && !isThisYear(this.startDate)) {
          obj.isSelected = true;
          obj.name = "End Season";
        }

        if (
          obj.name === "1st Spray" ||
          obj.name === "2nd Spray" ||
          obj.name === "3rd Spray"
        ) {
          obj.emergence = this.preData[i - 1].emergence;
          obj.cHrGrowth = this.preData[i - 1].cHrGrowth;
        }
        return obj;
      });
    }
    // console.log(this.preData);
    return this.preData;
  }

  @computed
  get modelDataOfSelectedDates() {
    if (this.modelData) {
      // console.log(this.modelData.filter(day => day.isSelected));
      return this.modelData.filter(day => day.isSelected);
    }
  }

  @computed
  get modelDataUpTo100() {
    if (isThisYear(this.startDate)) {
      if (this.todayEmergence < 100) {
        console.log("One");
        console.log(this.modelData.slice(0, this.idxAtThreshold + 1));
        return this.modelData.slice(0, this.idxAtThreshold + 1);
      } else {
        console.log("Two");
        console.log(this.modelData);
        return this.modelData;
      }
    }
    console.log("Three");
    console.log(this.modelData);
    return this.modelData;
  }

  @computed
  get isThereNow() {
    return this.modelDataUpTo100.some(o => o.name === "Now");
  }
}
