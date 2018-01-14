import { observable, action, when } from "mobx";

export default class StateStore {
  app;
  constructor(app) {
    this.app = app;
    when(() => this.states.length === 0, () => this.loadStates());
  }

  @observable states = [];
  @action updateStates = d => (d = this.states = d);

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
}
