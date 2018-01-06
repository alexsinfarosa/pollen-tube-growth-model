import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DevTools from "mobx-react-devtools";

// Components
import AppHeader from "components/AppHeader";

@inject("app")
@observer
class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppHeader />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque nam
          numquam sapiente delectus, fugit aspernatur natus minus architecto
          earum sequi consequatur autem deserunt enim doloremque ratione,
          perferendis laboriosam ipsum voluptatem.
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
