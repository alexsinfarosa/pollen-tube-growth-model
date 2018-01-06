import { observable } from "mobx";

class AppStore {
  constructor(fetch) {
    this.fetch = fetch;
  }
  @observable isLoading = false;
}

export default new AppStore();
