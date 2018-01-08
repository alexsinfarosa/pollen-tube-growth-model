import { observable, action, computed, when } from "mobx";

export default class DateTimeStore {
  app;
  constructor(app) {
    this.app = app;
  }

  @observable date;

  @computed
  get currentYear() {
    if (this.date) {
      return format(this.date, "YYYY");
    }
    return getYear(new Date());
  }

  @computed
  get seasonStartDate() {
    if (this.date) {
      return `${this.currentYear}-03-01`;
    }
  }

  @computed
  get seasonEndDate() {
    if (this.date) {
      return `${this.currentYear}-07-01`;
    }
  }

  @computed
  get isSeason() {
    if (this.date) {
      return (
        isAfter(this.date, this.seasonStartDate) &&
        isBefore(this.date, this.seasonEndDate)
      );
    }
  }

  @computed
  get resetDate() {
    if (this.dateRange.length > 1) {
      return this.dateRange[this.dateRange.length - 2].date;
    }
    return this.date;
  }

  @observable firstSprayDate;
  @action setFirstSprayDate = d => (this.firstSprayDate = d);
  @observable secondSprayDate;
  @action setSecondSprayDate = d => (this.secondSprayDate = d);
  @observable thirdSprayDate;
  @action setThirdSprayDate = d => (this.thirdSprayDate = d);

  @observable endDate = `${this.currentYear}-07-01`;
  @action setEndDate = d => (this.endDate = d);

  // calculate the index for the Step component
  @computed
  get currentIndex() {
    const { date, firstSpray, secondSpray, thirdSpray } = this.block;
    const dates = [date, firstSpray, secondSpray, thirdSpray]
      .map(date => (date === undefined ? 0 : date))
      .map(date => format(date, "x"));
    const max = Math.max(...dates);
    return dates.findIndex(date => date === max.toString());
  }
}
