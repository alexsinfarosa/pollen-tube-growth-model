import { observable, action, computed, when } from "mobx";
import moment from "moment";
// import { toJS } from "mobx";

// utils
import { roundDate, dailyToHourlyDates } from "utils/utils";
import { loadACISData } from "utils/cleanFetchedData";

// antd
import { message } from "antd";
import getHours from "date-fns/get_hours";

import format from "date-fns/format";
import getYear from "date-fns/get_year";
// import isThisYear from "date-fns/is_this_year";
import isAfter from "date-fns/is_after";
import isBefore from "date-fns/is_before";
// import differenceInHours from "date-fns/difference_in_hours";
import addDays from "date-fns/add_days";
import isEqual from "date-fns/is_equal";
import getTime from "date-fns/get_time";

class Block {
  id;
  @observable name;
  @observable variety;
  @observable state;
  @observable station;
  @observable styleLengths;
  @observable dates;
  @observable data;
  @observable isBeingSelected;
  @observable isBeingEdited;

  constructor({
    id,
    name,
    variety,
    state,
    station,
    styleLengths,
    dates,
    data,
    isBeingSelected,
    isBeingEdited
  }) {
    this.id = id;
    this.name = name;
    this.variety = variety;
    this.state = state;
    this.station = station;
    this.styleLengths = styleLengths;
    this.dates = dates;
    this.data = data;
    this.isBeingSelected = isBeingSelected;
    this.isBeingEdited = isBeingEdited;
  }

  @computed
  get startDate() {
    if (this.dates.length !== 0) {
      return this.dates[0];
    }
  }

  @computed
  get currentYear() {
    if (this.startDate) {
      return format(this.startDate, "YYYY");
    }
    return getYear(new Date());
  }

  @computed
  get seasonStartDate() {
    if (this.startDate) {
      return `${this.currentYear}-03-01 00:00`;
    }
  }

  @computed
  get seasonEndDate() {
    if (this.startDate) {
      return `${this.currentYear}-05-01 23:00`;
    }
  }

  @computed
  get isSeason() {
    if (this.startDate) {
      return (
        isAfter(this.startDate, this.seasonStartDate) &&
        isBefore(this.startDate, this.seasonEndDate)
      );
    }
  }

  @computed
  get now() {
    if (isAfter(Date.now(), this.seasonEndDate)) {
      return this.seasonEndDate;
    }
    return format(Date.now(), "MM/DD/YY HH:00");
  }

  @computed
  get stepDate() {
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
        status
      });
    });

    const today = {
      name: "Today",
      date: this.now,
      status: "finish"
    };
    return [...results, today];
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
  get modelData() {
    if (this.dates.length !== 0 && this.avgStyleLength) {
      const startHour = getHours(this.dates[this.dates.length - 1]);
      // const endHour = getHours(this.now);
      // const lastIdx = 24 - endHour;

      const data = this.data.slice(startHour);

      let cumulativeHrGrowth = 0;
      let percentage = 0;

      let cumulativeHrGrowthSpray = 0;
      let percentageSpray = 0;

      return data.map((arr, i) => {
        const { date, temp } = arr;
        const { hrGrowth, temps } = this.variety;
        const dateNow = getTime(date);

        const idx = temps.findIndex(t => t.toString() === temp);
        let hourlyGrowth = hrGrowth[idx];
        if (temp < 35 || temp > 106 || temp === "M") hourlyGrowth = 0;

        const formattedDates = this.dates.map(d =>
          format(d, "YYYY-MM-DD HH:00")
        );
        const isOneOfTheDates = formattedDates.some(d => isEqual(dateNow, d));
        if (isOneOfTheDates) {
          cumulativeHrGrowthSpray = 0;
          percentageSpray = 0;
        }

        cumulativeHrGrowthSpray += hourlyGrowth;
        percentageSpray = cumulativeHrGrowthSpray / this.avgStyleLength * 100;

        cumulativeHrGrowth += hourlyGrowth;
        percentage = cumulativeHrGrowth / this.avgStyleLength * 100;

        return {
          date: dateNow,
          Date: format(date, "MM-DD HH:00"),
          Temperature: Number(temp),
          hourlyGrowth,
          cumulativeHrGrowth: Number(cumulativeHrGrowth.toFixed(3)),
          percentage: Number(percentage.toFixed(3)),
          "Cumulative Hourly Growth": Number(
            cumulativeHrGrowthSpray.toFixed(3)
          ),
          percentageSpray: Number(percentageSpray.toFixed(3)),
          "Average Style Length": Number(this.avgStyleLength)
        };
      });
    }
  }
}

export default class BlockStore {
  app;
  constructor(app) {
    this.app = app;
    when(() => this.blocks.length === 0, () => this.readFromLocalStorage());
  }

  @observable isLoading = false;
  // Dates ----------------------------------------------------------------------------
  @observable date;
  @action
  setDate = d => {
    this.date = roundDate(d, moment.duration(60, "minutes"), "floor");
  };
  @action
  setStartDate = () => {
    this.block.dates.push(this.date);
    this.isDateModal = false;
    this.fetchAndUploadData();
  };

  @computed
  get startDate() {
    return this.block.dates[0];
  }

  @computed
  get currentYear() {
    if (this.startDate) {
      return format(this.startDate, "YYYY");
    }
    return getYear(new Date());
  }

  @computed
  get seasonStartDate() {
    if (this.startDate) {
      return `${this.currentYear}-03-01 00:00`;
    }
  }

  @computed
  get seasonEndDate() {
    if (this.startDate) {
      return `${this.currentYear}-05-01 23:00`;
    }
  }

  @computed
  get now() {
    if (isAfter(Date.now(), this.seasonEndDate)) {
      return this.seasonEndDate;
    }
    return format(Date.now(), "MM/DD/YY HH:00");
  }

  @action
  addSprayDate = id => {
    const block = this.blocks.find(b => b.id === id);
    this.block = block;
    const now = this.block.dates[this.block.dates.length - 1];

    const temp = roundDate(
      moment(addDays(now, 5)),
      moment.duration(60, "minutes"),
      "floor"
    );
    this.block.dates.push(temp);
    this.updateBlock();
  };

  @action
  replaceDate = () => {
    const dateToReplace = this.block.dates.find(date => date === this.date);

    const idx = this.block.dates.findIndex(dateToReplace);
    this.block.dates.splice(idx, 1, this.date);
    this.updateBlock();
  };

  // style length
  @observable styleLength;
  setStyleLength = d => (this.styleLength = d);

  // Modals
  @observable isBlockModal = false;
  @observable isDateModal = false;
  @observable isStyleLengthModal = false;
  @observable isMap = false;
  @action toggleMap = () => (this.isMap = !this.isMap);
  @action showModal = name => (this[name] = true);

  // radioValue
  @observable radioValue = "";
  @action setRadioValue = d => (this.radioValue = d);

  // blocks
  @observable blocks = [];

  // block
  @observable
  block = {
    id: null,
    name: "",
    variety: undefined,
    state: undefined,
    station: undefined,
    styleLengths: [],
    dates: [],
    data: [],
    isBeingSelected: false,
    isBeingEdited: false
  };

  @action
  clearFields = () => {
    this.date = undefined;
    this.styleLength = undefined;
    this.radioValue = "";
    this.isBlockModal = false;
    this.isDateModal = false;
    this.isStyleLengthModal = false;
    this.block.id = null;
    this.block.name = "";
    this.block.variety = undefined;
    this.block.state = undefined;
    this.block.station = undefined;
    this.block.styleLengths = [];
    this.block.dates = [];
    this.block.data = [];
    this.block.isBeingSelected = false;
    this.block.isBeingEdited = false;
    this.readFromLocalStorage();
  };

  @computed
  get isDataLoaded() {
    return this.blocks.map(bl => bl.data.length !== 0);
  }

  @action
  selectBlock = (name, id) => {
    this.showModal(name);
    const block = this.blocks.find(b => b.id === id);
    this.block = block;
  };

  @action
  addField = (name, val) => {
    if (name === "variety") {
      this.block[name] = this.app.apples.get(val);
    }
    if (name === "state") {
      this.block[name] = this.app.states.find(s => s.postalCode === val);
    }
    if (name === "station") {
      this.block[name] = this.app.stations.find(s => s.id === val);
    }
    if (name === "name") {
      this.block[name] = val;
    }
  };

  @computed //FIX
  get areRequiredFieldsSet() {
    const { name, variety, state, station } = this.block;
    return name.length >= 3 && variety && state && station;
  }

  @action
  addBlock = () => {
    if (this.areRequiredFieldsSet) {
      const block = { ...this.block };
      block.isBeingSelected = true;
      block.id = Date.now();
      this.blocks.push(new Block(block));
      this.selectOneBlock(block.id);
      this.writeToLocalStorage();
      this.clearFields();
      message.success(`${block.name} block has been created!`);
    }
  };

  @action
  removeBlock = id => {
    const idx = this.blocks.findIndex(b => b.id === id);
    const block = { ...this.blocks[idx] };
    this.blocks.splice(idx, 1);
    this.writeToLocalStorage();
    message.success(`${block.name} block has been deleted!`);
  };

  @action
  editBlock = id => {
    const block = this.blocks.find(b => b.id === id);
    block.isBeingEdited = true;
    this.block = block;
    this.showModal("isBlockModal");
  };

  fetchAndUploadData = () => {
    this.isLoading = true;
    const block = { ...this.block };
    const blocks = [...this.blocks];

    loadACISData(block.station, this.startDate, this.now).then(res => {
      block.data = dailyToHourlyDates(Array.from(res.get("cStationClean")));
      const idx = this.blocks.findIndex(b => b.id === block.id);
      blocks.splice(idx, 1, block);
      this.blocks = blocks;
      this.writeToLocalStorage();
      this.clearFields();
      this.isLoading = false;
      message.success(`${block.name} block has been updated!`);
    });
  };

  @action
  updateBlock = () => {
    const block = { ...this.block };
    const blocks = [...this.blocks];
    block.isBeingEdited = false;
    block.styleLengths.forEach(sl => (sl.isEdit = false));
    const idx = this.blocks.findIndex(b => b.id === block.id);
    blocks.splice(idx, 1, block);
    this.blocks = blocks;
    this.selectOneBlock(block.id);
    this.writeToLocalStorage();
    this.clearFields();
    message.success(`${block.name} block has been updated!`);
  };

  @action
  selectOneBlock = id => {
    this.blocks.forEach(block => {
      block.id === id
        ? (block.isBeingSelected = true)
        : (block.isBeingSelected = false);
    });
  };

  @action
  selectAllBlocks = () => {
    this.isMap = false;
    const areAllBlocksDisplayed = this.blocks.every(bl => bl.isBeingSelected);
    areAllBlocksDisplayed
      ? this.blocks.forEach(bl => (bl.isBeingSelected = false))
      : this.blocks.forEach(bl => (bl.isBeingSelected = true));
  };

  @action cancelButton = () => this.clearFields();

  // Style length ---------------------------------------------------------------------
  @action
  addAvgStyleLength = () => {
    let highiestIdx = 0;
    if (this.block.styleLengths.length !== 0) {
      const tempArr = this.block.styleLengths.map(obj => obj.idx);
      highiestIdx = Math.max(...tempArr);
    }
    const styleLengthObj = {
      idx: highiestIdx + 1,
      styleLength: this.styleLength,
      isEdit: false
    };
    this.block.styleLengths.push(styleLengthObj);
    this.updateBlock();
  };

  @action
  addOneStyleLength = () => {
    const block = { ...this.block };
    let highiestIdx = 0;
    if (block.styleLengths.length !== 0) {
      const tempArr = block.styleLengths.map(obj => obj.idx);
      highiestIdx = Math.max(...tempArr);
    }

    const styleLengthObj = {
      id: Math.random(),
      idx: highiestIdx + 1,
      styleLength: this.styleLength,
      isEdit: false
    };
    block.styleLengths.push(styleLengthObj);
    this.styleLength = undefined;
  };

  @action
  removeStyleLength = (record, idx) => {
    const styleLengths = [...this.block.styleLengths];
    const below = styleLengths.slice(0, idx);
    const above = styleLengths.slice(idx + 1);
    above.map(obj => (obj.idx = obj.idx - 1));
    const newArr = [...below, ...above];
    this.block.styleLengths = newArr;
  };

  @computed
  get isStyleLengthBeingEdited() {
    return this.block.styleLengths.some(sl => sl.isEdit);
  }

  @action
  editStyleLength = (record, idx) => {
    this.setStyleLength(record.styleLength);
    this.block.styleLengths[idx].isEdit = true;
  };

  @action
  updateOneStyleLength = () => {
    const obj = this.block.styleLengths.find(sl => sl.isEdit === true);
    obj.styleLength = this.styleLength;
    obj.isEdit = false;

    const idx = this.block.styleLengths.findIndex(d => d.id === obj.id);
    this.block.styleLengths.splice(idx, 1, obj);
    this.styleLength = undefined;
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
        this.blocks.push(new Block(json));
      });
    }
  };
}
