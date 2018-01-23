import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
import { MatchMediaProvider } from "mobx-react-matchmedia";
// import DevTools from "mobx-react-devtools";

// styled components
import { Header, SubHeader, SubHeaderRight, Main } from "styles";

// Components
import AppToolBar from "components/AppToolBar";
import BlockList from "components/block/BlockList";
import Instructions from "components/Instructions";

// Modals
import NewBlockModal from "modals/NewBlockModal";
import StartDateModal from "modals/StartDateModal";
import StyleLengthModal from "modals/StyleLengthModal";

@inject("app")
@observer
class App extends Component {
  render() {
    const { bpts, bStore } = this.props.app;
    return (
      <div>
        <MatchMediaProvider breakpoints={bpts}>
          <Header>
            <SubHeader>
              Pollen Tube Growth Model Developed By Virginia Tech
            </SubHeader>
            <SubHeaderRight>NEWA</SubHeaderRight>
          </Header>

          <NewBlockModal />

          <StartDateModal breakpoints={bpts} />
          <StyleLengthModal breakpoints={bpts} />

          <Main>
            <AppToolBar breakpoints={bpts} />
            {bStore.blocks.length !== 0 ? <BlockList /> : <Instructions />}
          </Main>
        </MatchMediaProvider>
      </div>
    );
    // return <div>ciccio</div>;
  }
}

export default App;
