import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

// Mobx
import stores from "stores";
import { Provider } from "mobx-react";

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();

if (module.hot) {
  module.hot.accept(() => {
    ReactDOM.render(
      <Provider {...stores}>
        <App />
      </Provider>,
      document.getElementById("root")
    );
  });
}
