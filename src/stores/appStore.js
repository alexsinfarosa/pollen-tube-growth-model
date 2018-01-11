import { observable, action, computed, when } from "mobx";
import SubjectStore from "./SubjectStore";
import StateStore from "./StateStore";
import StationStore from "./StationStore";
import BlockStore from "./BlockStore";

import format from "date-fns/format";
import getHours from "date-fns/get_hours";

import { loadACISData } from "utils/cleanFetchedData";
import { dailyToHourlyDates } from "utils/utils";

export default class AppStore {
  fetch;
  subject;
  acisStates;
  acisStations;
  blockStore;
  @observable seasonStartDate = "2017-03-01";
  @observable selectedDate = "2017-05-15";

  constructor(fetcher) {
    this.fetch = fetcher;
    this.subject = new SubjectStore(this);
    this.acisStates = new StateStore(this);
    this.acisStations = new StationStore(this);
    this.blockStore = new BlockStore(this);
    when(() => !this.isLoading, () => this.loadData());
  }

  @action
  loadData = () => {
    console.log("loadData");
    this.listOfStationsToFetch.forEach(station => {
      loadACISData(station, this.seasonStartDate, this.selectedDate).then(
        res => {
          this.blocks.forEach(block => {
            if (block.station === station.id) {
              block.data = dailyToHourlyDates(
                Array.from(res.get("cStationClean"))
              );
            }
          });
        }
      );
    });
  };

  get apples() {
    return this.subject.subjects;
  }

  get states() {
    return this.acisStates.states;
  }

  get state() {
    return this.block.state;
  }

  get station() {
    return this.blocks.station;
  }

  get stations() {
    return this.acisStations.stations;
  }

  get currentStateStations() {
    if (this.state === "All States") {
      return this.stations;
    }

    return this.stations.filter(station => station.state === this.state);
  }

  @computed
  get listOfStationsToFetch() {
    const stationList = Array.from(new Set(this.blocks.map(bl => bl.station)));
    const stationListObj = stationList.map(station =>
      this.stations.find(s => s.id === station)
    );
    // console.log(stationListObj);
    return stationListObj;
  }

  get isLoading() {
    return this.acisStations.isLoading;
  }

  get blocks() {
    return this.blockStore.blocks;
  }

  get filteredBlocks() {
    return this.blocks.filter(block => block.isBeingSelected);
  }

  get block() {
    return this.blockStore.block;
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

  formatDate = date => {
    return format(date, "MM/DD/YY HH:00");
  };

  addZeroToHoursLessThen10 = d => {
    if (d >= 0 && d <= 8) return `0${d + 1}`;
    return d + 1;
  };

  transformGridData = res => {
    const { dateRange, variety, avgStyleLength } = this.filteredBlocks[0];
    const { hrGrowth, temps } = variety;
    let date;
    if (dateRange.length !== 0) {
      date = dateRange[dateRange.length - 2].date;
    }

    const hour = getHours(date);
    const hourIdx = hour - 1;

    let results = [];
    let cumulativeHrGrowth = 0;
    let percentage = 0;

    const filteredFirstDayTemps = res[0][1].slice(hourIdx);
    // first day. The starting hour is selected by the user
    filteredFirstDayTemps.forEach((temp, h) => {
      const idx = temps.findIndex(t => t.toString() === temp);
      let hourlyGrowth = hrGrowth[idx];
      if (temp < 35 || temp > 106 || temp === "M") hourlyGrowth = 0;
      cumulativeHrGrowth += hourlyGrowth;
      percentage = cumulativeHrGrowth / avgStyleLength * 100;
      results.push({
        date: `${format(date, "YYYY-MM-DD")} ${this.addZeroToHoursLessThen10(
          h + hourIdx
        )}:00`,
        temp: temp,
        hrGrowth: hourlyGrowth,
        cumulativeHrGrowth: cumulativeHrGrowth,
        percentage: percentage
      });
    });

    // body. Does not include first and last day
    const dates = res.slice(1, -1).map(day => day[0]);
    const values = res.slice(1, -1).map(day => day[1]);
    dates.forEach((date, i) => {
      values[i].forEach((temp, h) => {
        const idx = temps.findIndex(t => t.toString() === temp);
        let hourlyGrowth = hrGrowth[idx];
        if (temp < 35 || temp > 106 || temp === "M") hourlyGrowth = 0;
        cumulativeHrGrowth += hourlyGrowth;
        percentage = cumulativeHrGrowth / avgStyleLength * 100;

        results.push({
          date: `${date} ${this.addZeroToHoursLessThen10(h)}:00`,
          temp: temp,
          hrGrowth: hourlyGrowth,
          cumulativeHrGrowth: cumulativeHrGrowth,
          percentage: percentage
        });
      });
    });

    const filteredLastDayTemps = res[res.length - 1][1].slice(0, hour);

    // last day.
    filteredLastDayTemps.forEach((temp, h) => {
      const idx = temps.findIndex(t => t.toString() === temp);
      let hourlyGrowth = hrGrowth[idx];
      if (temp < 35 || temp > 106 || temp === "M") hourlyGrowth = 0;
      cumulativeHrGrowth += hourlyGrowth;
      percentage = cumulativeHrGrowth / avgStyleLength * 100;

      results.push({
        date: `${res[res.length - 1][0]} ${this.addZeroToHoursLessThen10(
          h
        )}:00`,
        temp: temp,
        hrGrowth: hourlyGrowth,
        cumulativeHrGrowth: cumulativeHrGrowth,
        percentage: percentage
      });
    });

    return results;
  };
}
