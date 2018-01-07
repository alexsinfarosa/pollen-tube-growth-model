import { observable, action, when } from "mobx";

export default class StateStore {
  app;
  constructor(app) {
    this.app = app;
    when(() => this.states.size === 0, () => this.loadStates());
  }

  @observable states = new Map();

  @action
  updateStates = json =>
    json.forEach(blockJson => this.states.set(blockJson.postalCode, blockJson));

  @action
  loadStates() {
    this.app
      .fetch("states.json")
      .then(json => {
        this.updateStates(json);
      })
      .catch(err => {
        console.log("Failed to load states", err);
      });
  }

  @observable
  state = JSON.parse(localStorage.getItem("state")) || this.states.get("ALL");

  @action
  setState = name => {
    this.state = this.states.find(state => state.name === name);
    localStorage.setItem("state", JSON.stringify(this.state));
  };

  @action
  setStateFromMap = state => {
    this.state = state;
    localStorage.setItem("state", JSON.stringify(this.state));
  };
}
