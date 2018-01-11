import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
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

// antd
import { Spin } from "antd";

@inject("app")
@observer
class App extends Component {
  render() {
    const { bpts, isLoading } = this.props.app;
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

          {isLoading ? (
            <Spin />
          ) : (
            <Main>
              <BlockList />
            </Main>
          )}
        </MatchMediaProvider>
      </div>
    );
    // return <div>ciccio</div>;
  }
}

export default App;
