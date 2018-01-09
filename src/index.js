import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

// Mobx
import { Provider } from "mobx-react";
import AppStore from "stores/AppStore";

const fetcher = url => window.fetch(url).then(response => response.json());
const app = new AppStore(fetcher);

ReactDOM.render(
  <Provider app={app}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();

if (module.hot) {
  module.hot.accept("stores/AppStore", () => {
    const NewApp = require("stores/AppStore").default;
    ReactDOM.render(
      <Provider app={app}>
        <NewApp />
      </Provider>,
      document.getElementById("root")
    );
  });
}
