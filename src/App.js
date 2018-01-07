import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { MatchMediaProvider } from "mobx-react-matchmedia";
import DevTools from "mobx-react-devtools";

// styled components
import { Header, SubHeader, SubHeaderRight, Main } from "styles";

// Components
import AppToolBar from "components/AppToolBar";

// Modals
import BlockModal from "modals/BlockModal";

@inject("app")
@observer
class App extends Component {
  render() {
    const { bpts } = this.props.app;
    return (
      <MatchMediaProvider breakpoints={bpts}>
        <DevTools />
        <Header>
          <SubHeader>
            Pollen Tube Growth Model Developed By Virginia Tech
          </SubHeader>
          <SubHeaderRight>NEWA</SubHeaderRight>
        </Header>

        <BlockModal />

        <AppToolBar breakpoints={bpts} />

        <Main>main...</Main>
      </MatchMediaProvider>
    );
  }
}

export default App;
