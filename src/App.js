import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { MatchMediaProvider } from "mobx-react-matchmedia";
import DevTools from "mobx-react-devtools";

// styled components
import { Header, SubHeader, SubHeaderRight, Main } from "styles";

// Components
import AppToolBar from "components/AppToolBar";
import BlockList from "components/block/BlockList";

// Modals
import BlockModal from "modals/BlockModal";
import StartDateModal from "modals/StartDateModal";
import StyleLengthModal from "modals/StyleLengthModal";

@inject("app")
@observer
class App extends Component {
  render() {
    const { bpts } = this.props.app;
    console.log(this.props.app.blocks.slice());
    return (
      <div>
        <DevTools />
        <MatchMediaProvider breakpoints={bpts}>
          <Header>
            <SubHeader>
              Pollen Tube Growth Model Developed By Virginia Tech
            </SubHeader>
            <SubHeaderRight>NEWA</SubHeaderRight>
          </Header>

          <BlockModal />

          <AppToolBar breakpoints={bpts} />
          <StartDateModal breakpoints={bpts} />
          <StyleLengthModal breakpoints={bpts} />

          <Main>
            <BlockList />
          </Main>
        </MatchMediaProvider>
      </div>
    );
  }
}

export default App;
