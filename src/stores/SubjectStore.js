import { observable, action, when } from "mobx";

export default class SubjectStore {
  app;
  constructor(app) {
    // app is the appStore
    this.app = app;
    this.fetch = fetch;
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

  @observable subject = {};

  @action
  setSubject = name => {
    this.subject = this.subjects.find(subject => subject.name === name);
    localStorage.setItem(`pollenTubeVariety`, JSON.stringify(this.subject));
  };
}
