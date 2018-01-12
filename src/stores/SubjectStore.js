import { observable, action, when } from "mobx";

export default class SubjectStore {
  app;
  constructor(app) {
    // app is the appStore
    this.app = app;
    when(() => this.subjects.size === 0, () => this.loadSubjects());
  }

  @observable subjects = new Map();

  @action
  updateSubjects = json =>
    json.forEach(blockJson => this.subjects.set(blockJson.name, blockJson));

  @action
  loadSubjects() {
    this.app
      .fetch("growthRates.json")
      .then(json => {
        this.updateSubjects(json);
      })
      .catch(err => {
        console.log("Failed to load subjects", err);
      });
  }
}
